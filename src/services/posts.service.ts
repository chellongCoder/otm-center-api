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
    return Posts.findOne({
      where: {
        id,
      },
    });
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
              category: CategoriesNotificationEnum.APPLIANCE_ABSENT,
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
  public async update(id: number, item: Posts) {
    return Posts.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Posts.delete(id);
  }
  public async getNewsfeedTeacher(userWorkspaceId: number, isPin: boolean, workspaceId: number) {
    return Posts.find({
      where: {
        isPin: typeof isPin === 'undefined' ? isPin : Boolean(!!isPin),
        workspaceId,
        byUserWorkspaceId: userWorkspaceId,
      },
      relations: ['postMedias', 'byUserWorkspace'],
    });
  }
  public async getNewsfeed(userWorkspaceId: number, isPin: boolean | undefined, workspaceId: number) {
    return Posts.find({
      where: _.omitBy(
        {
          isPin: typeof isPin === 'undefined' ? isPin : Boolean(!!isPin),
          postUserWorkspaces: {
            userWorkspaceId: userWorkspaceId,
          },
          workspaceId,
        },
        _.isNil,
      ),
      relations: ['postMedias', 'byUserWorkspace'],
    });
  }
}
