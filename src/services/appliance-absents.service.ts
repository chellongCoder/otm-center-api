import { ApplianceAbsents } from '@/models/appliance-absents.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { DbConnection } from '@/database/dbConnection';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Timetables } from '@/models/timetables.model';
import { In } from 'typeorm';
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
    return await ApplianceAbsents.find({
      where: {
        userWorkspaceId: userWorkspaceId,
        workspaceId: workspaceId,
      },
      relations: ['applianceAbsentTimetables', 'applianceAbsentTimetables.timetable', 'applianceAbsentTimetables.timetable.class'],
    });
  }

  public async getListTeacherApplianceAbsents(userWorkspaceId: number, workspaceId: number, classId: number) {
    const classData = await this.classesService.checkExistClass(classId, workspaceId, ['timetables']);
    const timetableIds = classData.timetables.map(el => el.id);
    return await ApplianceAbsents.find({
      where: {
        workspaceId: workspaceId,
        applianceAbsentTimetables: {
          timetableId: In(timetableIds),
        },
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
  }

  /**
   * findById
   */
  public async findById(id: number) {
    return ApplianceAbsents.findOne({
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

          messageNotification = `${!messageNotification ? messageNotification : `${messageNotification}, `}ca ${moment(timetableItem.fromTime).format(
            'HH:ss',
          )} - ${moment(timetableItem.toTime).format('HH:ss')} ngày ${moment(timetableItem.date).format('DD/MM/YYYY')}`;
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
          newUserWorkspaceNotification.receiverUserWorkspaceId = receiveUserWorkspaceId;
          newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
          newUserWorkspaceNotification.workspaceId = workspaceId;
        }
        await queryRunner.manager.getRepository(UserWorkspaceNotifications).insert(bulkCreateUserWorkspaceNotifications);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
        return true;
      }
    } else throw new Exception(ExceptionName.SERVICE_CONNECT_FAIL, ExceptionCode.SERVICE_CONNECT_FAIL);
  }

  /**
   * updateStatus
   */
  public async updateStatus(id: number, item: UpdateStatusApplianceAbsentsDto, userWorkspaceId: number) {
    return ApplianceAbsents.update(id, {
      status: item.status,
      updateByUserWorkspaceId: userWorkspaceId,
    });
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return ApplianceAbsents.delete(id);
  }
}
