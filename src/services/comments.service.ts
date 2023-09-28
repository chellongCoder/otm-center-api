import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreateCommentsDto } from '@/dtos/create-comments.dto';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { UpdateCommentsDto } from '@/dtos/update-comments.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Timetables } from '@/models/timetables.model';
import { CategoriesNotificationEnum, SendMessageNotificationRabbit, sendNotificationToRabbitMQ } from '@/utils/rabbit-mq.util';
import { AppType, UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import _ from 'lodash';
import { TimeFormat } from '@/constants';
import moment from 'moment-timezone';
import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { UserWorkspaceDevices } from '@/models/user-workspace-devices.model';

@Service()
export class CommentsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Comments.findByCond({
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
   * getListComments
   */
  public async getListComments(targetKey: string, category: CategoriesCommentsEnum, workspaceId: number) {
    return Comments.find({
      where: {
        targetKey,
        workspaceId,
        category,
      },
      relations: ['rootComment', 'subComments', 'userWorkspace', 'subComments.userWorkspace'],
      order: {
        createdAt: 'ASC',
        subComments: {
          createdAt: 'ASC',
        },
      },
    });
  }

  /**
   * findById
   */
  public async findById(id: number) {
    return Comments.findOne({
      where: {
        id,
      },
      relations: ['rootComment', 'subComments', 'userWorkspace'],
      order: {
        createdAt: 'ASC',
        subComments: {
          createdAt: 'ASC',
        },
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateCommentsDto, userWorkspaceData: UserWorkspaces) {
    let targetTimetableId = 0;
    let targetUserWorkspaceId = 0;
    if (item?.targetKey) {
      targetTimetableId = Number(item.targetKey.split('_')[1]);
      targetUserWorkspaceId = Number(item.targetKey.split('_')[4]);
    } else if (item?.parentId) {
      const parentComment = await Comments.findOne({
        where: {
          id: item.parentId,
        },
      });
      if (parentComment?.id) {
        targetTimetableId = Number(parentComment.targetKey.split('_')[1]);
        targetUserWorkspaceId = Number(parentComment.targetKey.split('_')[4]);
      } else {
        throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
      }
    } else {
      throw new Exception(ExceptionName.VALIDATE_FAILED, ExceptionCode.VALIDATE_FAILED);
    }
    if (item.category === CategoriesCommentsEnum.HOMEWORK || item.category === CategoriesCommentsEnum.EVALUATION) {
      const timetableData = await Timetables.findOne({
        where: {
          id: targetTimetableId,
        },
        relations: [
          'class',
          'classShiftsClassroom.userWorkspaceShiftScopes',
          'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
          'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace.userWorkspaceDevices',
        ],
      });
      if (timetableData) {
        const playerIds: string[] = [];
        const messageNotification = `Có bình luận mới trong ${
          item.category === CategoriesCommentsEnum.HOMEWORK ? 'bài tập về nhà' : 'đánh giá'
        } buổi thứ ${timetableData.sessionNumberOrder} ngày ${moment(timetableData.date).format(TimeFormat.date)} lớp ${timetableData.class.name}.`;
        const userWorkspaceShiftScopeData = timetableData.classShiftsClassroom.userWorkspaceShiftScopes;
        let userWorkspaceShiftScopeApplyData: UserWorkspaceShiftScopes[] = [];
        if (targetUserWorkspaceId === userWorkspaceData.id) {
          userWorkspaceShiftScopeApplyData = userWorkspaceShiftScopeData;
        } else {
          userWorkspaceShiftScopeApplyData = userWorkspaceShiftScopeData.filter(el => el.userWorkspaceId !== userWorkspaceData.id);
        }
        const receiveUserWorkspaceIds: number[] = userWorkspaceShiftScopeApplyData.map(el => el.userWorkspaceId);

        const userWorkspaceDeviceData = userWorkspaceShiftScopeApplyData.map(el => el.userWorkspace.userWorkspaceDevices).flat();
        for (const userWorkspaceDeviceItem of userWorkspaceDeviceData) {
          playerIds.push(userWorkspaceDeviceItem.playerId);
        }
        const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];

        if (playerIds.length) {
          const msg: SendMessageNotificationRabbit = {
            type: AppType.TEACHER,
            data: {
              category: CategoriesNotificationEnum.COMMENT,
              content: messageNotification,
              id: targetTimetableId,
              playerIds: _.uniq(playerIds),
            },
          };
          await sendNotificationToRabbitMQ(msg);

          for (const receiveUserWorkspaceId of _.uniq(receiveUserWorkspaceIds)) {
            const newUserWorkspaceNotification = new UserWorkspaceNotifications();
            newUserWorkspaceNotification.content = messageNotification;
            newUserWorkspaceNotification.appType = AppType.TEACHER;
            newUserWorkspaceNotification.msg = JSON.stringify(msg);
            newUserWorkspaceNotification.detailId = `${targetTimetableId}`;
            newUserWorkspaceNotification.date = moment().toDate();
            newUserWorkspaceNotification.receiverUserWorkspaceId = receiveUserWorkspaceId;
            newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceData.id;
            newUserWorkspaceNotification.workspaceId = userWorkspaceData.workspaceId;
            bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
          }
        }
        if (targetUserWorkspaceId !== userWorkspaceData.id) {
          const userWorkspaceDeviceData = await UserWorkspaceDevices.find({
            where: {
              userWorkspaceId: targetUserWorkspaceId,
            },
          });
          for (const userWorkspaceDeviceItem of userWorkspaceDeviceData) {
            playerIds.push(userWorkspaceDeviceItem.playerId);
          }
          const msg: SendMessageNotificationRabbit = {
            type: AppType.STUDENT,
            data: {
              category: CategoriesNotificationEnum.COMMENT,
              content: messageNotification,
              id: targetTimetableId,
              playerIds: _.uniq(playerIds),
            },
          };
          await sendNotificationToRabbitMQ(msg);

          const newUserWorkspaceNotification = new UserWorkspaceNotifications();
          newUserWorkspaceNotification.content = messageNotification;
          newUserWorkspaceNotification.appType = AppType.STUDENT;
          newUserWorkspaceNotification.msg = JSON.stringify(msg);
          newUserWorkspaceNotification.detailId = `${targetTimetableId}`;
          newUserWorkspaceNotification.date = moment().toDate();
          newUserWorkspaceNotification.receiverUserWorkspaceId = targetUserWorkspaceId;
          newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceData.id;
          newUserWorkspaceNotification.workspaceId = userWorkspaceData.workspaceId;
          bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
        }
        if (bulkCreateUserWorkspaceNotifications.length) {
          await UserWorkspaceNotifications.insert(bulkCreateUserWorkspaceNotifications);
        }
      }
    }
    if (item.category === CategoriesCommentsEnum.APPLIANCE_ABSENT && targetUserWorkspaceId !== userWorkspaceData.id) {
      const targetAbsentId = targetTimetableId;
      const playerIds: string[] = [];
      const messageNotification = `Có bình luận mới trong đơn xin nghỉ của học viên.`;
      const userWorkspaceDeviceData = await UserWorkspaceDevices.find({
        where: {
          userWorkspaceId: targetUserWorkspaceId,
        },
      });
      for (const userWorkspaceDeviceItem of userWorkspaceDeviceData) {
        playerIds.push(userWorkspaceDeviceItem.playerId);
      }
      if (playerIds.length) {
        const msg: SendMessageNotificationRabbit = {
          type: AppType.STUDENT,
          data: {
            category: CategoriesNotificationEnum.COMMENT,
            content: messageNotification,
            id: targetAbsentId,
            playerIds: _.uniq(playerIds),
          },
        };
        await sendNotificationToRabbitMQ(msg);

        const newUserWorkspaceNotification = new UserWorkspaceNotifications();
        newUserWorkspaceNotification.content = messageNotification;
        newUserWorkspaceNotification.appType = AppType.STUDENT;
        newUserWorkspaceNotification.msg = JSON.stringify(msg);
        newUserWorkspaceNotification.detailId = `${targetAbsentId}`;
        newUserWorkspaceNotification.date = moment().toDate();
        newUserWorkspaceNotification.receiverUserWorkspaceId = targetUserWorkspaceId;
        newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceData.id;
        newUserWorkspaceNotification.workspaceId = userWorkspaceData.workspaceId;
        await UserWorkspaceNotifications.insert(newUserWorkspaceNotification);
      }
    }
    const results = await Comments.insert({
      ...item,
      userWorkspaceId: userWorkspaceData.id,
      workspaceId: userWorkspaceData.workspaceId,
    });
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: UpdateCommentsDto, userWorkspaceData: UserWorkspaces) {
    const commentData = await Comments.findOne({
      where: {
        id,
        userWorkspaceId: userWorkspaceData.id,
      },
    });
    if (!commentData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    if (commentData.userWorkspaceId === userWorkspaceData.id) {
      return Comments.update(id, item);
    } else {
      throw new Exception(ExceptionName.PERMISSION_DENIED, ExceptionCode.PERMISSION_DENIED);
    }
  }

  /**
   * delete
   */
  public async delete(id: number, userWorkspaceId: number) {
    const commentData = await Comments.findOne({ where: { id } });
    if (!commentData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    if (commentData.userWorkspaceId === userWorkspaceId) {
      return Comments.softRemove(commentData);
    } else {
      throw new Exception(ExceptionName.PERMISSION_DENIED, ExceptionCode.PERMISSION_DENIED);
    }
  }
}
