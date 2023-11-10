import { AbsentStatus, ApplianceAbsents } from '@/models/appliance-absents.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { DbConnection } from '@/database/dbConnection';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Timetables } from '@/models/timetables.model';
import { Between, FindOptionsWhere, In } from 'typeorm';
import { ApplianceAbsentTimetables } from '@/models/appliance-absent-timetables.model';
import { ApplianceAbsentsDto } from '@/dtos/create-appliance-absent.dto';
import { ClassesService } from './classes.service';
import { UpdateStatusApplianceAbsentsDto } from '@/dtos/update-status-appliance-absent.dto';
import { CategoriesNotificationEnum, SendMessageNotificationRabbit, sendNotificationToRabbitMQ } from '@/utils/rabbit-mq.util';
import { AppType, UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import { Workspaces } from '@/models/workspaces.model';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import moment from 'moment-timezone';
import _ from 'lodash';
import { TimeFormat } from '@/constants';
import { UpdateNoteApplianceAbsentsDto } from '@/dtos/update-note-appliance-absent.dto';
import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';
import { AttendanceStatus, ClassTimetableDetails } from '@/models/class-timetable-details.model';
import { Classes } from '@/models/classes.model';

@Service()
export class ApplianceAbsentsService {
  constructor(public classesService: ClassesService) {}
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await ApplianceAbsents.findByCond({
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

  public async getListStudentApplianceAbsents(userWorkspaceId: number, workspaceId: number) {
    const applianceAbsentResult = await ApplianceAbsents.find({
      where: {
        userWorkspaceId: userWorkspaceId,
        workspaceId: workspaceId,
      },
      relations: ['applianceAbsentTimetables', 'applianceAbsentTimetables.timetable', 'applianceAbsentTimetables.timetable.class'],
      order: {
        createdAt: 'DESC',
      },
    });

    const targetKeys = applianceAbsentResult.map(el => `detail_${el.id}`);
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey: In(targetKeys),
        workspaceId: workspaceId,
        category: CategoriesCommentsEnum.APPLIANCE_ABSENT,
      },
      relations: ['subComments'],
    });
    const formatResult = [];
    for (const applianceAbsentResultItem of applianceAbsentResult) {
      const targetKey = `detail_${applianceAbsentResultItem.id}`;
      const listComment = commentData.filter(el => el.targetKey === targetKey);
      const countComment = listComment.length + listComment.map(el => el.subComments.length).reduce((total, count) => total + count, 0);
      formatResult.push({
        ...applianceAbsentResultItem,
        countComment,
      });
    }
    return formatResult;
  }

  public async getListTeacherApplianceAbsents(
    userWorkspaceId: number,
    workspaceId: number,
    classId?: number,
    status?: AbsentStatus,
    fromDate?: number,
    toDate?: number,
  ) {
    let timetableIds: number[] = [];
    if (classId) {
      const classData = await this.classesService.checkExistClass(classId, workspaceId, ['timetables']);
      timetableIds = classData.timetables.map(el => el.id);
    } else {
      const classTeacher = await Classes.find({
        where: {
          classShiftsClassrooms: {
            userWorkspaceShiftScopes: {
              userWorkspaceId: userWorkspaceId,
            },
          },
        },
        relations: ['timetables'],
      });
      if (classTeacher && classTeacher.length) {
        timetableIds = classTeacher.reduce((acc, curr) => {
          acc.push(...curr.timetables.map(el => el.id));
          return acc;
        }, <number[]>[]);
      }
    }
    let condition: FindOptionsWhere<ApplianceAbsents> = {
      workspaceId: workspaceId,
      applianceAbsentTimetables: {
        timetableId: In(timetableIds),
      },
    };
    if (fromDate && toDate) {
      condition = {
        ...condition,
        applianceAbsentTimetables: {
          timetable: {
            date: Between(moment(fromDate, 'YYYYMMDD').toDate(), moment(toDate, 'YYYYMMDD').toDate()),
          },
        },
      };
    }
    if (status) {
      condition = {
        ...condition,
        status,
      };
    }
    const applianceAbsentResult = await ApplianceAbsents.find({
      where: condition,
      relations: [
        'userWorkspace',
        'updateByUserWorkspace',
        'applianceAbsentTimetables',
        'applianceAbsentTimetables.timetable',
        'applianceAbsentTimetables.timetable.class',
        'applianceAbsentTimetables.timetable.classShiftsClassroom',
        'applianceAbsentTimetables.timetable.classShiftsClassroom.classroom',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
    const targetKeys = applianceAbsentResult.map(el => `detail_${el.id}`);
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey: In(targetKeys),
        workspaceId: workspaceId,
        category: CategoriesCommentsEnum.APPLIANCE_ABSENT,
      },
      relations: ['subComments'],
    });

    const formatResult = [];
    for (const applianceAbsentResultItem of applianceAbsentResult) {
      const targetKey = `detail_${applianceAbsentResultItem.id}`;
      const listComment = commentData.filter(el => el.targetKey === targetKey);
      const countComment = listComment.length + listComment.map(el => el.subComments.length).reduce((total, count) => total + count, 0);
      formatResult.push({
        ...applianceAbsentResultItem,
        countComment,
      });
    }
    return formatResult;
  }

  /**
   * findById
   */
  public async findById(id: number) {
    const data = await ApplianceAbsents.findOne({
      where: {
        id,
      },
      relations: [
        'userWorkspace',
        'updateByUserWorkspace',
        'applianceAbsentTimetables',
        'applianceAbsentTimetables.timetable',
        'applianceAbsentTimetables.timetable.class',
        'applianceAbsentTimetables.timetable.classShiftsClassroom',
        'applianceAbsentTimetables.timetable.classShiftsClassroom.classroom',
      ],
    });

    const targetKey = `detail_${id}`;
    const commentData: Comments[] = await Comments.find({
      where: {
        targetKey,
        category: CategoriesCommentsEnum.APPLIANCE_ABSENT,
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
  public async create(item: ApplianceAbsentsDto, userWorkspaceData: UserWorkspaces, workspaceData: Workspaces) {
    const workspaceId = workspaceData.id;
    const userWorkspaceId = userWorkspaceData.id;
    let messageNotification = ``;
    const playerIds: string[] = [];
    const receiveUserWorkspaceIds: number[] = [];
    const timetableData = await Timetables.find({
      where: {
        id: In(item.timetableIds),
      },
      relations: [
        'classShiftsClassroom',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace.userWorkspaceDevices',
      ],
    });
    if (!timetableData.length) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const applianceAbsentDataExist = await ApplianceAbsents.find({
      where: {
        userWorkspaceId: userWorkspaceId,
        workspaceId: workspaceId,
        // status: In(AbsentStatus.APPROVED, AbsentStatus.NOT_APPROVED_YET, AbsentStatus.CANCEL),
        applianceAbsentTimetables: {
          timetableId: In(item.timetableIds),
        },
      },
    });
    if (applianceAbsentDataExist && applianceAbsentDataExist.length) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const newAppliance = await queryRunner.manager.getRepository(ApplianceAbsents).insert({
          userWorkspaceId: userWorkspaceId,
          note: item.note,
          workspaceId: workspaceId,
        });
        const bulkCreateApplianceAbsentTimetables: ApplianceAbsentTimetables[] = [];
        for (const timetableItem of timetableData) {
          const newApplianceTimetable = new ApplianceAbsentTimetables();
          newApplianceTimetable.timetableId = timetableItem.id;
          newApplianceTimetable.applianceAbsentId = newAppliance.identifiers[0]?.id;
          newApplianceTimetable.workspaceId = workspaceId;
          bulkCreateApplianceAbsentTimetables.push(newApplianceTimetable);

          messageNotification = `${!messageNotification ? messageNotification : `${messageNotification}, `}ca ${moment(
            timetableItem.fromTime,
            'HH:mm:ss',
          ).format('HH:mm')} - ${moment(timetableItem.toTime, 'HH:mm:ss').format('HH:mm')} ngày ${moment(timetableItem.date).format(
            TimeFormat.date,
          )}`;
          const userWorkspaceShiftScopesData = timetableItem.classShiftsClassroom.userWorkspaceShiftScopes;
          for (const userWorkspaceShiftScopeItem of userWorkspaceShiftScopesData) {
            const userWorkspaceDevicesData = userWorkspaceShiftScopeItem.userWorkspace.userWorkspaceDevices;
            for (const userWorkspaceDeviceItem of userWorkspaceDevicesData) {
              playerIds.push(userWorkspaceDeviceItem.playerId);
              receiveUserWorkspaceIds.push(userWorkspaceDeviceItem.userWorkspaceId);
            }
          }
        }
        await queryRunner.manager.getRepository(ApplianceAbsentTimetables).insert(bulkCreateApplianceAbsentTimetables);
        /**
         * push notification
         */
        if (playerIds.length) {
          const contentNotify = `${workspaceData.name} Đơn xin nghỉ của học viên ${userWorkspaceData.fullname} ${messageNotification} chờ duyệt`;
          const msg: SendMessageNotificationRabbit = {
            type: AppType.TEACHER,
            data: {
              category: CategoriesNotificationEnum.APPLIANCE_ABSENT,
              content: contentNotify,
              id: newAppliance.identifiers[0]?.id,
              playerIds: _.uniq(playerIds),
            },
          };
          await sendNotificationToRabbitMQ(msg);

          const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];
          for (const receiveUserWorkspaceId of _.uniq(receiveUserWorkspaceIds)) {
            const newUserWorkspaceNotification = new UserWorkspaceNotifications();
            newUserWorkspaceNotification.content = contentNotify;
            newUserWorkspaceNotification.appType = AppType.TEACHER;
            newUserWorkspaceNotification.msg = JSON.stringify(msg);
            newUserWorkspaceNotification.detailId = newAppliance.identifiers[0]?.id;
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

  public async updateNote(id: number, item: UpdateNoteApplianceAbsentsDto, userWorkspaceData: UserWorkspaces) {
    const applianceAbsentData = await ApplianceAbsents.findOne({
      where: {
        id,
        userWorkspaceId: userWorkspaceData.id,
      },
    });
    if (!applianceAbsentData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    return await ApplianceAbsents.update(id, {
      note: item.note,
    });
  }
  /**
   * updateStatus
   */
  public async updateStatus(id: number, item: UpdateStatusApplianceAbsentsDto, userWorkspaceData: UserWorkspaces) {
    const userWorkspaceId = userWorkspaceData.id;
    const applianceAbsentData = await ApplianceAbsents.findOne({
      where: {
        id,
      },
      relations: ['userWorkspace', 'userWorkspace.userWorkspaceDevices', 'applianceAbsentTimetables', 'applianceAbsentTimetables.timetable'],
    });
    if (!applianceAbsentData) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    await ApplianceAbsents.update(id, {
      status: item.status,
      updateByUserWorkspaceId: userWorkspaceId,
    });
    let shiftMessages = '';
    const applianceAbsentTimetableData = applianceAbsentData.applianceAbsentTimetables;
    const timetableIds: number[] = [];
    for (const applianceAbsentTimetableItem of applianceAbsentTimetableData) {
      timetableIds.push(applianceAbsentTimetableItem.timetableId);
      shiftMessages = `${shiftMessages ? `${shiftMessages}, ca` : ''} ${moment(
        applianceAbsentTimetableItem.timetable.fromTime,
        TimeFormat.time,
      ).format(TimeFormat.hours)} - ${moment(applianceAbsentTimetableItem.timetable.toTime, TimeFormat.time).format(TimeFormat.hours)} ngày ${moment(
        applianceAbsentTimetableItem.timetable.date,
      ).format(TimeFormat.date)}`;
    }
    /**
     * update AttendanceStatus of ClassTimetableDetails
     */
    if (item.status === AbsentStatus.APPROVED) {
      await ClassTimetableDetails.createQueryBuilder('class_timetable_details')
        .update(ClassTimetableDetails)
        .set({ attendanceStatus: AttendanceStatus.ABSENT_WITH_LEAVE })
        .where('class_timetable_details.timetable_id IN  (:...timetableIds)', { timetableIds })
        .andWhere('class_timetable_details.user_workspace_id = :id', { id: applianceAbsentData.userWorkspace.id })
        .execute();
    }

    const contentNotify = `Đơn xin nghỉ của học viên ${applianceAbsentData.userWorkspace.fullname} ca${shiftMessages} đã được phê duyệt`;

    const playerIds: string[] = [];
    for (const userWorkspaceDeviceItem of applianceAbsentData.userWorkspace.userWorkspaceDevices) {
      playerIds.push(userWorkspaceDeviceItem.playerId);
    }

    const msg: SendMessageNotificationRabbit = {
      type: AppType.STUDENT,
      data: {
        category: CategoriesNotificationEnum.APPLIANCE_ABSENT,
        content: contentNotify,
        id: id,
        playerIds: _.uniq(playerIds),
      },
    };
    await sendNotificationToRabbitMQ(msg);
    const newUserWorkspaceNotification = new UserWorkspaceNotifications();
    newUserWorkspaceNotification.content = contentNotify;
    newUserWorkspaceNotification.appType = AppType.STUDENT;
    newUserWorkspaceNotification.msg = JSON.stringify(msg);
    newUserWorkspaceNotification.detailId = `${id}`;
    newUserWorkspaceNotification.date = moment().toDate();
    newUserWorkspaceNotification.receiverUserWorkspaceId = applianceAbsentData.userWorkspaceId;
    newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
    newUserWorkspaceNotification.workspaceId = userWorkspaceData.workspaceId;
    await UserWorkspaceNotifications.insert(newUserWorkspaceNotification);
    return true;
  }

  /**
   * delete
   */
  public async delete(id: number) {
    const applianceAbsentData = await ApplianceAbsents.findOne({
      where: {
        id,
      },
      relations: ['applianceAbsentTimetables', 'applianceAbsentTimetables.timetable'],
    });
    console.log('chh_log ---> delete ---> applianceAbsentData:', applianceAbsentData);
    if (!applianceAbsentData) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const applianceAbsentTimetableData = applianceAbsentData.applianceAbsentTimetables;
    const timetableIds: number[] = [];
    for (const applianceAbsentTimetableItem of applianceAbsentTimetableData) {
      timetableIds.push(applianceAbsentTimetableItem.timetableId);
    }
    console.log('chh_log ---> delete ---> timetableIds:', timetableIds, applianceAbsentData.userWorkspaceId);
    /**
     * update AttendanceStatus of ClassTimetableDetails
     */
    if (timetableIds) {
      await ClassTimetableDetails.createQueryBuilder('class_timetable_details')
        .update(ClassTimetableDetails)
        .set({ attendanceStatus: undefined })
        .where('class_timetable_details.timetable_id IN  (:...timetableIds)', { timetableIds })
        .andWhere('class_timetable_details.user_workspace_id = :id', { id: applianceAbsentData.userWorkspaceId })
        .execute();
    }
    await ApplianceAbsents.softRemove(applianceAbsentData);
    return true;
  }
}
