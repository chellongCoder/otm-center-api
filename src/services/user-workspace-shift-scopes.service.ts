import { UserWorkspaceClasses } from '@/models/user-workspace-classes.model';
import { CheckShiftClassroomValidDto } from '@/dtos/check-shift-classroom-valid.dto';
import _ from 'lodash';
import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Shifts } from '@/models/shifts.model';
import { CreateClassScheduleDto, UserWorkspaceShiftScopesDto } from '@/dtos/create-user-workspace-shift-scope.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Workspaces } from '@/models/workspaces.model';
import { UserWorkspaceTypes, UserWorkspaces } from '@/models/user-workspaces.model';
import { Between, In } from 'typeorm';
import { Classrooms } from '@/models/classrooms.model';
import { Classes } from '@/models/classes.model';
import { ClassShiftsClassrooms } from '@/models/class-shifts-classrooms.model';
import { Timetables } from '@/models/timetables.model';
import moment from 'moment-timezone';

@Service()
export class UserWorkspaceShiftScopesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaceShiftScopes.findByCond({
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
    return UserWorkspaceShiftScopes.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: UserWorkspaceShiftScopes) {
    const results = await UserWorkspaceShiftScopes.insert(item);
    return results;
  }

  /**
   * create with business rule
   */
  public async createClassSchedule(item: CreateClassScheduleDto) {
    const workspaceData = await Workspaces.findOne({ where: { id: item.workspaceId } });
    if (!workspaceData) {
      throw new Exception(ExceptionName.WORKSPACE_NOT_FOUND, ExceptionCode.WORKSPACE_NOT_FOUND);
    }
    const classData = await Classes.findOne({
      where: {
        id: item.classId,
        workspaceId: item.workspaceId,
      },
    });
    if (!classData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }
    const classroomData = await Classrooms.findOne({
      where: {
        id: item.classroomId,
        workspaceId: item.workspaceId,
      },
    });
    if (!classroomData?.id) {
      throw new Exception(ExceptionName.CLASSROOM_NOT_FOUND, ExceptionCode.CLASSROOM_NOT_FOUND);
    }
    const shiftData = await Shifts.findOne({
      where: {
        id: item.shiftId,
        workspaceId: item.workspaceId,
      },
    });
    if (!shiftData?.id) {
      throw new Exception(ExceptionName.SHIFT_NOT_FOUND, ExceptionCode.SHIFT_NOT_FOUND);
    }
    if (!item.userWorkspaces.length) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_NOT_FOUND);
    }
    const classShiftsClassroomExist = await ClassShiftsClassrooms.findOne({
      where: {
        shiftId: item.shiftId,
        classroomId: item.classroomId,
        classId: item.classId,
        workspaceId: item.workspaceId,
      },
    });
    if (classShiftsClassroomExist?.id) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }
    const userWorkspaceData: UserWorkspaceShiftScopesDto[] = _.uniqBy(item.userWorkspaces, 'userWorkspaceId');
    this.validateUserWorkspaceTimeShift({ shift: shiftData, userWorkspaceShiftScopes: userWorkspaceData });
    const userWorkspaceIds: number[] = userWorkspaceData.map(el => el.userWorkspaceId);
    const userWorkspaceCount = await UserWorkspaces.count({
      where: {
        id: In(userWorkspaceIds),
        userWorkspaceType: UserWorkspaceTypes.TEACHER,
      },
    });
    if (userWorkspaceCount !== userWorkspaceIds.length) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_INVALID_TYPE);
    }
    /**
     * create schedule
     */

    const classShiftsClassroom = new ClassShiftsClassrooms();
    classShiftsClassroom.shiftId = shiftData.id;
    classShiftsClassroom.classroomId = classroomData.id;
    classShiftsClassroom.classId = classData.id;
    classShiftsClassroom.workspaceId = workspaceData.id;
    classShiftsClassroom.validDate = moment(item.validDate, 'YYYY-MM-DD').toDate();
    const classShiftsClassroomData = await ClassShiftsClassrooms.insert(classShiftsClassroom);
    /**
     * assign teacher
     */
    const bulkCreateShiftScopes: UserWorkspaceShiftScopes[] = [];
    for (const userWorkspaceItem of userWorkspaceData) {
      const userWorkspaceShiftScope = new UserWorkspaceShiftScopes();
      userWorkspaceShiftScope.workspaceId = workspaceData.id;
      userWorkspaceShiftScope.userWorkspaceId = userWorkspaceItem.userWorkspaceId;
      userWorkspaceShiftScope.validDate = moment(item.validDate, 'YYYY-MM-DD').toDate();
      userWorkspaceShiftScope.title = userWorkspaceItem.title;
      userWorkspaceShiftScope.fromTime = moment(userWorkspaceItem.fromTime, 'HHmmss').toDate();
      userWorkspaceShiftScope.toTime = moment(userWorkspaceItem.toTime, 'HHmmss').toDate();
      userWorkspaceShiftScope.note = userWorkspaceItem.note;
      userWorkspaceShiftScope.classShiftsClassroomsId = classShiftsClassroomData.identifiers[0]?.id;

      bulkCreateShiftScopes.push(userWorkspaceShiftScope);
    }

    return await UserWorkspaceShiftScopes.insert(bulkCreateShiftScopes);
  }

  public validateUserWorkspaceTimeShift({
    shift,
    userWorkspaceShiftScopes,
  }: {
    shift: Shifts;
    userWorkspaceShiftScopes: UserWorkspaceShiftScopesDto[];
  }) {
    for (const userWorkspaceItem of userWorkspaceShiftScopes) {
      if (Number(userWorkspaceItem.fromTime) < Number(`${shift.fromTime}`.replaceAll(':', ''))) {
        throw new Exception(ExceptionName.SHIFT_TIME_INPUT_INVALID, ExceptionCode.SHIFT_TIME_INPUT_INVALID);
      }
      if (Number(userWorkspaceItem.toTime) > Number(shift.toTime)) {
        throw new Exception(ExceptionName.SHIFT_TIME_INPUT_INVALID, ExceptionCode.SHIFT_TIME_INPUT_INVALID);
      }
    }
  }

  /**
   * validate shift classrooms
   */
  public async checkShiftClassrooms(item: CheckShiftClassroomValidDto) {
    // WIP check time before create entity
    console.log('chh_log ---> checkShiftClassrooms ---> item:', item);
    return true;
  }
  /**
   * validate user_workspace assign
   */

  /**
   * update
   */
  public async update(id: number, item: UserWorkspaceShiftScopes) {
    return UserWorkspaceShiftScopes.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaceShiftScopes.delete(id);
  }
  public async getTeachingSchedule(
    page = 1,
    limit = 10,
    order = 'id:asc',
    search: string,
    userWorkspaceId: number,
    workspaceId: number,
    fromDate: number,
    toDate: number,
  ) {
    const userWorkspaceShiftScopesData = await UserWorkspaceShiftScopes.find({
      where: {
        userWorkspaceId,
        workspaceId,
      },
    });
    if (!userWorkspaceShiftScopesData.length) {
      return null;
    }
    const classShiftsClassroomsIds = userWorkspaceShiftScopesData.map(el => el.classShiftsClassroomsId);
    if (!fromDate || !toDate) {
      throw new Exception(ExceptionName.SHIFT_TIME_INPUT_INVALID, ExceptionCode.SHIFT_TIME_INPUT_INVALID);
    }
    return await Timetables.find({
      where: {
        classShiftsClassroomId: In(classShiftsClassroomsIds),
        workspaceId,
        date: Between(moment(fromDate, 'YYYYMMDD').toDate(), moment(toDate, 'YYYYMMDD').toDate()),
      },
      relations: [
        'class',
        'class.course',
        'shift',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
      ],
      order: {
        date: 'ASC',
        fromTime: 'ASC',
      },
    });
  }

  public async getTeachingDashboard(page = 1, limit = 10, order = 'id:asc', userWorkspaceId: number, workspaceId: number, currentDate: number) {
    const userWorkspaceShiftScopesData = await UserWorkspaceShiftScopes.find({
      where: {
        userWorkspaceId,
        workspaceId,
      },
    });
    if (!userWorkspaceShiftScopesData.length) {
      return null;
    }
    const classShiftsClassroomsIds = userWorkspaceShiftScopesData.map(el => el.classShiftsClassroomsId);
    if (!currentDate) {
      throw new Exception(ExceptionName.SHIFT_TIME_INPUT_INVALID, ExceptionCode.SHIFT_TIME_INPUT_INVALID);
    }
    const orderCond = QueryParser.toOrderCond(order);
    const [classesData, total] = await Classes.findAndCount({
      where: {
        classShiftsClassrooms: {
          id: In(classShiftsClassroomsIds),
        },
      },
      order: { [orderCond.sort]: orderCond.order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['classShiftsClassrooms', 'course', 'classShiftsClassrooms.shift'],
    });
    /**
     * get user_workspaces in class
     */
    const classesIds = classesData.map(el => el.id);
    const userWorkspaceClasses = await UserWorkspaceClasses.find({
      where: {
        classId: In(classesIds),
        workspaceId,
      },
      relations: ['userWorkspace'],
    });
    if (!classesData.length) {
      return null;
    }
    /**
     * get latest timetable
     */
    const timetableData = await Timetables.find({
      where: {
        classShiftsClassroomId: In(classShiftsClassroomsIds),
        workspaceId,
        date: Between(moment(currentDate, 'YYYYMMDD').subtract(15, 'days').toDate(), moment(currentDate, 'YYYYMMDD').toDate()),
      },
      order: {
        date: 'desc',
        fromTime: 'desc',
      },
      relations: ['classTimetableDetails'],
    });

    const teachingDashboard: any[] = [];
    for (const classItem of classesData) {
      const userWorkspaceInClass = userWorkspaceClasses.filter(el => el.classId === classItem.id);
      const latestTimetable = timetableData.find(el => el.classId === classItem.id);
      let isAllAttendance = true;
      let isAllEvaluation = true;
      if (latestTimetable?.id) {
        const latestClassTimetableDetailData = latestTimetable.classTimetableDetails;
        for (const latestClassTimetableDetailItem of latestClassTimetableDetailData) {
          if (!latestClassTimetableDetailItem.attendanceByUserWorkspaceId) {
            isAllAttendance = false;
          }
          if (!latestClassTimetableDetailItem.evaluationByUserWorkspaceId) {
            isAllEvaluation = false;
          }
        }
      }
      teachingDashboard.push({
        ...classItem,
        userWorkspaces: userWorkspaceInClass,
        userWorkspacesCount: userWorkspaceInClass.length,
        latestTimetable,
        isAllAttendance,
        isAllEvaluation,
      });
    }
    return {
      data: teachingDashboard,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
