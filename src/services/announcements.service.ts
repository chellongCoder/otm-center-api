import { Announcements } from '@/models/announcements.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreateAnnouncementDto } from '@/dtos/create-annountcement.dto';
import { UserWorkspaceTypes, UserWorkspaces } from '@/models/user-workspaces.model';
import { DbConnection } from '@/database/dbConnection';
import { AnnouncementUserWorkspaces } from '@/models/announcement-user-workspaces.model';
import { Workspaces } from '@/models/workspaces.model';
import { UserWorkspaceDevices } from '@/models/user-workspace-devices.model';
import { In } from 'typeorm';
import { CategoriesNotificationEnum, SendMessageNotificationRabbit, sendNotificationToRabbitMQ } from '@/utils/rabbit-mq.util';
import { AppType, UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import _ from 'lodash';
import moment from 'moment-timezone';
import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';

@Service()
export class AnnouncementsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Announcements.findByCond({
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
    const data = await Announcements.findOne({
      where: {
        id,
      },
      relations: ['workspace', 'favoriteUserWorkspaces'],
    });

    const targetKey = `detail_${id}`;
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey,
        category: CategoriesCommentsEnum.NOTIFICATION,
      },
      relations: ['subComments'],
    });
    return {
      ...data,
      commentData,
      countComment: commentData.length + commentData.map(el => el.subComments.length).reduce((total, count) => total + count, 0),
    };
  }

  /**
   * findById
   */
  public async getList(userWorkspaceData: UserWorkspaces, isImportant: boolean) {
    const announcementResult = await Announcements.find({
      where: {
        isImportant: typeof isImportant === 'undefined' ? isImportant : Boolean(!!isImportant),
        announcementUserWorkspaces: {
          userWorkspaceId: userWorkspaceData.id,
        },
      },
      relations: ['workspace', 'favoriteUserWorkspaces'],
    });
    const targetKeys = announcementResult.map(el => `detail_${el.id}`);
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey: In(targetKeys),
        workspaceId: userWorkspaceData.workspaceId,
        category: CategoriesCommentsEnum.NOTIFICATION,
      },
      relations: ['subComments'],
    });
    const formatResult = [];
    for (const announcementResultItem of announcementResult) {
      const targetKey = `detail_${announcementResultItem.id}`;
      const listComment = commentData.filter(el => el.targetKey === targetKey);
      const countComment = listComment.length + listComment.map(el => el.subComments.length).reduce((total, count) => total + count, 0);
      const countFavorite = announcementResultItem.favoriteUserWorkspaces.length;
      const isLiked = announcementResultItem.favoriteUserWorkspaces.find(el => el.userWorkspaceId === userWorkspaceData.id) ? true : false;
      formatResult.push({
        ...announcementResultItem,
        countComment,
        isLiked,
        countFavorite,
      });
    }
    return formatResult;
  }

  /**
   * create
   */
  public async create(item: CreateAnnouncementDto, userWorkspaceData: UserWorkspaces, workspaceData: Workspaces) {
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const announcementCreate = await queryRunner.manager.getRepository(Announcements).insert({
          title: item.title,
          content: item.content,
          url: item.url,
          createdByUserWorkspaceId: userWorkspaceData.id,
          workspaceId: userWorkspaceData.workspaceId,
          isImportant: item.isImportant,
          allowComment: item.allowComment,
        });
        const bulkUpdateAnnouncementDetails: Partial<AnnouncementUserWorkspaces>[] = [];
        for (const userWorkspaceId of item.userWorkspaceIds) {
          const AnnouncementUserWorkspaceCreate = new AnnouncementUserWorkspaces();
          AnnouncementUserWorkspaceCreate.userWorkspaceId = userWorkspaceId;
          AnnouncementUserWorkspaceCreate.announcementId = announcementCreate.identifiers[0].id;
          AnnouncementUserWorkspaceCreate.workspaceId = workspaceData.id;
          bulkUpdateAnnouncementDetails.push(AnnouncementUserWorkspaceCreate);
        }
        await queryRunner.manager.getRepository(AnnouncementUserWorkspaces).insert(bulkUpdateAnnouncementDetails);

        /**
         * push notification
         */

        const userWorkspaceDevicesData = await UserWorkspaceDevices.find({
          where: {
            userWorkspaceId: In(item.userWorkspaceIds),
          },
          relations: ['userWorkspace'],
        });
        const teacherPlayerIds: string[] = [];
        const teacherReceiveIds: number[] = [];
        const studentPlayerIds: string[] = [];
        const studentReceiveIds: number[] = [];
        for (const userWorkspaceDeviceItem of userWorkspaceDevicesData) {
          if (userWorkspaceDeviceItem.userWorkspace.userWorkspaceType === UserWorkspaceTypes.TEACHER) {
            teacherPlayerIds.push(userWorkspaceDeviceItem.playerId);
            teacherReceiveIds.push(userWorkspaceDeviceItem.userWorkspaceId);
          } else if (userWorkspaceDeviceItem.userWorkspace.userWorkspaceType === UserWorkspaceTypes.STUDENT) {
            studentPlayerIds.push(userWorkspaceDeviceItem.playerId);
            studentReceiveIds.push(userWorkspaceDeviceItem.userWorkspaceId);
          }
        }
        if (teacherPlayerIds.length || teacherReceiveIds.length) {
          const contentNotify = `${workspaceData.name} Thông báo: ${item.title}`;
          const msgTeacher: SendMessageNotificationRabbit = {
            type: AppType.TEACHER,
            data: {
              category: CategoriesNotificationEnum.NOTIFICATION,
              content: contentNotify,
              id: announcementCreate.identifiers[0]?.id,
              playerIds: _.uniq(teacherPlayerIds),
            },
          };
          const msgStudent: SendMessageNotificationRabbit = {
            type: AppType.STUDENT,
            data: {
              category: CategoriesNotificationEnum.NOTIFICATION,
              content: contentNotify,
              id: announcementCreate.identifiers[0]?.id,
              playerIds: _.uniq(studentPlayerIds),
            },
          };
          await sendNotificationToRabbitMQ(msgTeacher);
          await sendNotificationToRabbitMQ(msgStudent);

          const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];
          for (const teacherReceiveId of _.uniq(teacherReceiveIds)) {
            const newUserWorkspaceNotification = new UserWorkspaceNotifications();
            newUserWorkspaceNotification.content = contentNotify;
            newUserWorkspaceNotification.appType = AppType.TEACHER;
            newUserWorkspaceNotification.msg = JSON.stringify(msgTeacher);
            newUserWorkspaceNotification.detailId = announcementCreate.identifiers[0]?.id;
            newUserWorkspaceNotification.date = moment().toDate();
            newUserWorkspaceNotification.receiverUserWorkspaceId = teacherReceiveId;
            newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceData.id;
            newUserWorkspaceNotification.workspaceId = workspaceData.id;
            bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
          }
          for (const studentReceiveId of _.uniq(studentReceiveIds)) {
            const newUserWorkspaceNotification = new UserWorkspaceNotifications();
            newUserWorkspaceNotification.content = contentNotify;
            newUserWorkspaceNotification.appType = AppType.STUDENT;
            newUserWorkspaceNotification.msg = JSON.stringify(msgStudent);
            newUserWorkspaceNotification.detailId = announcementCreate.identifiers[0]?.id;
            newUserWorkspaceNotification.date = moment().toDate();
            newUserWorkspaceNotification.receiverUserWorkspaceId = studentReceiveId;
            newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceData.id;
            newUserWorkspaceNotification.workspaceId = workspaceData.id;
            bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
          }
          console.log('chh_log ---> create ---> bulkCreateUserWorkspaceNotifications:', bulkCreateUserWorkspaceNotifications);
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
  public async update(id: number, item: Announcements) {
    return Announcements.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Announcements.delete(id);
  }
}
