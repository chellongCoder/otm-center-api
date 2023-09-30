import { Posts } from '@/models/posts.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreatePostDto } from '@/dtos/create-post.dto';
import { DbConnection } from '@/database/dbConnection';
import { PostUserWorkspaces } from '@/models/post-user-workspaces.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { UserWorkspaceClassesService } from './user-workspace-classes.service';
import { PostMedias } from '@/models/post-medias.model';
import { In } from 'typeorm';
import _ from 'lodash';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { Workspaces } from '@/models/workspaces.model';
import { Classes } from '@/models/classes.model';
import { AppType, UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import { CategoriesNotificationEnum, SendMessageNotificationRabbit, sendNotificationToRabbitMQ } from '@/utils/rabbit-mq.util';
import { UserWorkspaceDevices } from '@/models/user-workspace-devices.model';
import moment from 'moment-timezone';
import { UpdatePostDto } from '@/dtos/update-post.dto';
import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';

@Service()
export class PostsService {
  constructor(public userWorkspaceClassesService: UserWorkspaceClassesService) {}
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Posts.findByCond({
      sort: orderCond.sort,
      order: orderCond.order,
      skip: (page - 1) * limit,
      take: limit,
      cache: false,
      search: QueryParser.toFilters(search),
    });
    return {
      data: filteredData[0],
      total: filteredData[1],
      pages: Math.ceil(filteredData[1] / limit),
    };
  }

  /**
   * findById
   */
  public async findById(id: number) {
    const data = await Posts.findOne({
      where: {
        id,
      },
      relations: ['postMedias', 'byUserWorkspace', 'postUserWorkspaces', 'postUserWorkspaces.userWorkspace', 'favoriteUserWorkspaces'],
    });

    const targetKey = `detail_${id}`;
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey,
        category: CategoriesCommentsEnum.NEW_POST,
      },
      relations: ['subComments'],
    });
    return {
      ...data,
      countComment: commentData.length + commentData.map(el => el.subComments.length).reduce((total, count) => total + count, 0),
    };
  }

  /**
   * create
   */
  public async create(item: CreatePostDto, userWorkspaceData: UserWorkspaces, workspaceData: Workspaces) {
    const userWorkspaceId = userWorkspaceData.id;
    const workspaceId = workspaceData.id;
    const classData = await Classes.findOne({
      where: {
        id: item.classId,
      },
    });
    if (!classData) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }

    const receiveUserWorkspaceIds: number[] = [];
    const playerIds: string[] = [];
    const messageNotification = `Lớp ${classData.name} có bài viết mới`;
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const postCreate = await queryRunner.manager.getRepository(Posts).insert({
          content: item.content,
          isPin: item.isPin,
          classId: item.classId,
          byUserWorkspaceId: userWorkspaceId,
          workspaceId,
        });
        /**
         * Create scope students can view post
         */
        if (!item.userWorkspaceIdScopes) {
          throw new Exception(ExceptionName.CLASS_NOT_FOUND_STUDENT, ExceptionCode.CLASS_NOT_FOUND_STUDENT);
        }
        const userWorkspaceClassesData = await this.userWorkspaceClassesService.getUserWorkspaceByClassId(item.classId);
        const studentIdsInClass = userWorkspaceClassesData.map(el => el.userWorkspaceId);
        if (item.userWorkspaceIdScopes.filter(el => !studentIdsInClass.includes(el)).length) {
          throw new Exception(ExceptionName.CLASS_NOT_FOUND_STUDENT, ExceptionCode.CLASS_NOT_FOUND_STUDENT);
        }
        const bulkUpdatePostUserWorkspaces: Partial<PostUserWorkspaces>[] = [];
        for (const userWorkspaceIdScopeItem of item.userWorkspaceIdScopes) {
          const postUserWorkspaceCreate = new PostUserWorkspaces();
          postUserWorkspaceCreate.userWorkspaceId = userWorkspaceIdScopeItem;
          postUserWorkspaceCreate.postId = postCreate.identifiers[0].id;
          postUserWorkspaceCreate.workspaceId = workspaceId;
          bulkUpdatePostUserWorkspaces.push(postUserWorkspaceCreate);
          receiveUserWorkspaceIds.push(userWorkspaceIdScopeItem);
        }
        await queryRunner.manager.getRepository(PostUserWorkspaces).insert(bulkUpdatePostUserWorkspaces);
        /**
         * create media link with post
         */
        if (item?.linkMediaPosts && item.linkMediaPosts.length) {
          const bulkUpdatePostMedias: Partial<PostMedias>[] = [];
          for (const linkMediaPostItem of item.linkMediaPosts) {
            const postMediaCreate = new PostMedias();
            postMediaCreate.link = linkMediaPostItem.link;
            postMediaCreate.type = linkMediaPostItem.type;
            postMediaCreate.postId = postCreate.identifiers[0].id;
            postMediaCreate.workspaceId = workspaceId;
            bulkUpdatePostMedias.push(postMediaCreate);
          }
          await queryRunner.manager.getRepository(PostMedias).insert(bulkUpdatePostMedias);
        }
        /**
         * push notification
         */

        const userWorkspaceDeviceData = await UserWorkspaceDevices.find({
          where: {
            userWorkspaceId: In(receiveUserWorkspaceIds),
          },
        });
        for (const userWorkspaceDeviceItem of userWorkspaceDeviceData) {
          playerIds.push(userWorkspaceDeviceItem.playerId);
        }

        if (playerIds.length) {
          const msg: SendMessageNotificationRabbit = {
            type: AppType.STUDENT,
            data: {
              category: CategoriesNotificationEnum.NEW_POST,
              content: messageNotification,
              id: postCreate.identifiers[0].id,
              playerIds: _.uniq(playerIds),
            },
          };
          await sendNotificationToRabbitMQ(msg);

          const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];
          for (const receiveUserWorkspaceId of _.uniq(receiveUserWorkspaceIds)) {
            const newUserWorkspaceNotification = new UserWorkspaceNotifications();
            newUserWorkspaceNotification.content = messageNotification;
            newUserWorkspaceNotification.appType = AppType.STUDENT;
            newUserWorkspaceNotification.msg = JSON.stringify(msg);
            newUserWorkspaceNotification.detailId = postCreate.identifiers[0].id;
            newUserWorkspaceNotification.date = moment().toDate();
            newUserWorkspaceNotification.receiverUserWorkspaceId = receiveUserWorkspaceId;
            newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
            newUserWorkspaceNotification.workspaceId = workspaceId;
            bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
          }
          await queryRunner.manager.getRepository(UserWorkspaceNotifications).insert(bulkCreateUserWorkspaceNotifications);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
    return true;
  }

  /**
   * update
   */
  public async update(id: number, item: UpdatePostDto, userWorkspaceData: UserWorkspaces) {
    const userWorkspaceId = userWorkspaceData.id;
    const postData = await Posts.findOne({
      where: {
        id,
      },
      relations: ['postMedias', 'postUserWorkspaces'],
    });
    if (!postData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.getRepository(Posts).update(id, {
          content: item.content,
          isPin: item.isPin,
          byUserWorkspaceId: userWorkspaceId,
        });
        /**
         * Update scope students can view post
         */
        if (!item.userWorkspaceIdScopes) {
          throw new Exception(ExceptionName.CLASS_NOT_FOUND_STUDENT, ExceptionCode.CLASS_NOT_FOUND_STUDENT);
        }
        const userWorkspaceIdScopesCurrent = postData.postUserWorkspaces.map(el => el.userWorkspaceId);
        const addUserWorkspaceIds = item.userWorkspaceIdScopes.filter(el => !userWorkspaceIdScopesCurrent.includes(el));
        const removeUserWorkspaceIds = userWorkspaceIdScopesCurrent.filter(el => !item.userWorkspaceIdScopes.includes(el));
        if (addUserWorkspaceIds.length) {
          const userWorkspaceClassesData = await this.userWorkspaceClassesService.getUserWorkspaceByClassId(postData.classId);
          const studentIdsInClass = userWorkspaceClassesData.map(el => el.userWorkspaceId);
          if (addUserWorkspaceIds.filter(el => !studentIdsInClass.includes(el)).length) {
            throw new Exception(ExceptionName.CLASS_NOT_FOUND_STUDENT, ExceptionCode.CLASS_NOT_FOUND_STUDENT);
          }
          const bulkUpdatePostUserWorkspaces: Partial<PostUserWorkspaces>[] = [];
          for (const userWorkspaceIdScopeItem of addUserWorkspaceIds) {
            const postUserWorkspaceCreate = new PostUserWorkspaces();
            postUserWorkspaceCreate.userWorkspaceId = userWorkspaceIdScopeItem;
            postUserWorkspaceCreate.postId = postData.id;
            postUserWorkspaceCreate.workspaceId = userWorkspaceData.workspaceId;
            bulkUpdatePostUserWorkspaces.push(postUserWorkspaceCreate);
          }
          await queryRunner.manager.getRepository(PostUserWorkspaces).insert(bulkUpdatePostUserWorkspaces);
        }
        if (removeUserWorkspaceIds.length) {
          const postUserWorkspaceDelete = postData.postUserWorkspaces.filter(el => removeUserWorkspaceIds.includes(el.userWorkspaceId));
          await queryRunner.manager.getRepository(PostUserWorkspaces).softDelete(postUserWorkspaceDelete.map(el => el.id));
        }
        /**
         * update media link with post
         */
        const postMediaCurrent = postData.postMedias;
        if ((item?.linkMediaPosts && item.linkMediaPosts.length) || postMediaCurrent.length) {
          const postMediaDelete: number[] = postMediaCurrent.map(el => el.id);
          if (postMediaDelete.length) {
            await queryRunner.manager.getRepository(PostMedias).softDelete(postMediaDelete);
          }
          if (item?.linkMediaPosts && item.linkMediaPosts.length) {
            const bulkUpdatePostMedias: Partial<PostMedias>[] = [];

            for (const linkMediaPostItem of item.linkMediaPosts) {
              const postMediaCreate = new PostMedias();
              postMediaCreate.link = linkMediaPostItem.link;
              postMediaCreate.type = linkMediaPostItem.type;
              postMediaCreate.postId = postData.id;
              postMediaCreate.workspaceId = userWorkspaceData.workspaceId;
              bulkUpdatePostMedias.push(postMediaCreate);
            }
            if (bulkUpdatePostMedias.length) {
              await queryRunner.manager.getRepository(PostMedias).insert(bulkUpdatePostMedias);
            }
          }
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
    return true;
  }

  /**
   * delete
   */
  public async delete(id: number) {
    const postData = await Posts.findOne({
      where: {
        id,
      },
      relations: ['postMedias', 'postUserWorkspaces'],
    });
    if (!postData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    await Posts.softRemove(postData);
    if (postData?.postMedias?.length) {
      await PostMedias.softRemove(postData.postMedias);
    }
    if (postData?.postUserWorkspaces?.length) {
      await PostUserWorkspaces.softRemove(postData.postUserWorkspaces);
    }
    return true;
  }
  public async getNewsfeedTeacher(userWorkspaceId: number, isPin: boolean, workspaceId: number, page = 1, limit = 10) {
    const [postResult, total] = await Posts.findAndCount({
      where: {
        isPin: typeof isPin === 'undefined' ? isPin : Boolean(!!isPin),
        workspaceId,
        byUserWorkspaceId: userWorkspaceId,
      },
      relations: ['postMedias', 'byUserWorkspace', 'postUserWorkspaces', 'postUserWorkspaces.userWorkspace', 'favoriteUserWorkspaces'],
      skip: (page - 1) * limit,
      take: limit,
    });
    const targetKeys = postResult.map(el => `detail_${el.id}`);
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey: In(targetKeys),
        workspaceId: workspaceId,
        category: CategoriesCommentsEnum.NEW_POST,
      },
      relations: ['subComments'],
    });

    const formatResult = [];
    for (const postResultItem of postResult) {
      const targetKey = `detail_${postResultItem.id}`;
      const listComment = commentData.filter(el => el.targetKey === targetKey);
      const countComment = listComment.length + listComment.map(el => el.subComments.length).reduce((total, count) => total + count, 0);
      const countFavorite = postResultItem.favoriteUserWorkspaces.length;
      const isLiked = postResultItem.favoriteUserWorkspaces.find(el => el.userWorkspaceId === userWorkspaceId) ? true : false;
      formatResult.push({
        ...postResultItem,
        countComment,
        isLiked,
        countFavorite,
      });
    }
    return {
      data: formatResult,
      total,
      pages: Math.ceil(total / limit),
    };
  }
  public async getNewsfeed(userWorkspaceId: number, isPin: boolean | undefined, workspaceId: number, page = 1, limit = 10) {
    const [postResult, total] = await Posts.findAndCount({
      where: _.omitBy(
        {
          isPin: typeof isPin === 'undefined' ? isPin : Boolean(!!isPin),
          postUserWorkspaces: {
            userWorkspaceId,
          },
          workspaceId,
        },
        _.isNil,
      ),
      relations: ['postMedias', 'byUserWorkspace', 'postUserWorkspaces', 'postUserWorkspaces.userWorkspace', 'favoriteUserWorkspaces'],
      skip: (page - 1) * limit,
      take: limit,
    });
    const targetKeys = postResult.map(el => `detail_${el.id}`);
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey: In(targetKeys),
        workspaceId: workspaceId,
        category: CategoriesCommentsEnum.NEW_POST,
      },
      relations: ['subComments'],
    });

    const formatResult = [];
    for (const postResultItem of postResult) {
      const targetKey = `detail_${postResultItem.id}`;
      const listComment = commentData.filter(el => el.targetKey === targetKey);
      const countComment = listComment.length + listComment.map(el => el.subComments.length).reduce((total, count) => total + count, 0);
      const countFavorite = postResultItem.favoriteUserWorkspaces.length;
      const isLiked = postResultItem.favoriteUserWorkspaces.find(el => el.userWorkspaceId === userWorkspaceId) ? true : false;
      formatResult.push({
        ...postResultItem,
        countComment,
        isLiked,
        countFavorite,
      });
    }
    return {
      data: formatResult,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
