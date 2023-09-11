import moment from 'moment-timezone';
import { UserWorkspaceClassTypes, UserWorkspaceClasses, ClassScheduleTypes, HomeworkStatus } from '@/models/user-workspace-classes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { In, IsNull, Like, MoreThanOrEqual, Not } from 'typeorm';
import { Classes } from '@/models/classes.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { Timetables } from '@/models/timetables.model';
import { ClassTimetableDetails } from '@/models/class-timetable-details.model';

@Service()
export class UserWorkspaceClassesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaceClasses.findByCond({
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
    return UserWorkspaceClasses.findOne({
      where: {
        id,
      },
    });
  }
  /**
   * findByFilter
   */
  public async findByFilter(userWorkspaceId: number, status: UserWorkspaceClassTypes) {
    return UserWorkspaceClasses.find({
      where: {
        userWorkspaceId,
        status,
      },
      relations: ['class', 'workspace', 'class.course'],
    });
  }

  /**
   * create
   */
  public async create(item: UserWorkspaceClasses) {
    const userWorkspaceData = await UserWorkspaces.findOne({
      where: {
        id: item.userWorkspaceId,
        workspaceId: item.workspaceId,
      },
    });
    if (!userWorkspaceData?.id) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_INVALID_TYPE);
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
    const checkExist = await UserWorkspaceClasses.findOne({
      where: {
        userWorkspaceId: userWorkspaceData.id,
        classId: classData.id,
        workspaceId: item.workspaceId,
      },
    });
    if (checkExist?.id) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }
    const results = await UserWorkspaceClasses.insert(item);
    /**
     * Add student to timetable
     */
    let timeTableData: Timetables[] = [];
    // WIP check classScheduleType type
    if (item.classScheduleType === ClassScheduleTypes.ALL) {
      timeTableData = await Timetables.find({
        where: {
          classId: classData.id,
          workspaceId: item.workspaceId,
          date: MoreThanOrEqual(moment(item.fromDate, 'YYYY-MM-DD').toDate()),
        },
      });
    }
    const bulkCreateClassTimetableDetails: ClassTimetableDetails[] = [];
    for (const timetableItem of timeTableData) {
      const classTimetableDetailCreate = new ClassTimetableDetails();
      classTimetableDetailCreate.timetableId = timetableItem.id;
      classTimetableDetailCreate.userWorkspaceId = item.userWorkspaceId;
      classTimetableDetailCreate.workspaceId = item.workspaceId;

      bulkCreateClassTimetableDetails.push(classTimetableDetailCreate);
    }
    if (bulkCreateClassTimetableDetails.length) {
      await ClassTimetableDetails.insert(bulkCreateClassTimetableDetails);
    }
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: UserWorkspaceClasses) {
    return UserWorkspaceClasses.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaceClasses.delete(id);
  }

  public async getHomeworkOfClass({
    userWorkspaceId,
    workspaceId,
    classId,
    status,
  }: {
    userWorkspaceId: number;
    workspaceId: number;
    classId: number;
    status: HomeworkStatus;
  }) {
    let conditionUserWorkspaceClass: any = {
      userWorkspaceId,
    };
    if (classId) {
      conditionUserWorkspaceClass = {
        ...conditionUserWorkspaceClass,
        classId,
      };
    }
    const userWorkspaceClassData = await UserWorkspaceClasses.find({
      where: conditionUserWorkspaceClass,
      relations: ['class'],
    });
    const classIds: number[] = userWorkspaceClassData.map(el => el.classId);
    let conditionTimetable: any = {
      classId: In(classIds),
      classLesson: {
        exercise: Not(IsNull()),
      },
      workspaceId,
    };
    if (status === HomeworkStatus.DONE) {
      conditionTimetable = {
        ...conditionTimetable,
        classTimetableDetails: {
          homeworkAssignment: Not(IsNull()),
        },
      };
    } else {
      const classTimetableDetailData = await ClassTimetableDetails.find({
        where: {
          timetable: {
            classId: In(classIds),
          },
          homeworkAssignment: Not(IsNull()),
          userWorkspaceId,
        },
      });
      const timetableHasAssignmentIds = classTimetableDetailData.map(el => el.timetableId);
      conditionTimetable = {
        ...conditionTimetable,
        id: Not(In(timetableHasAssignmentIds)),
      };
    }
    const timetableExistLesson = await Timetables.find({
      where: conditionTimetable,
      relations: [
        'classLesson',
        'classLesson.classLessonImages',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.classTimetableDetailAssignments',
      ],
      order: {
        sessionNumberOrder: 'ASC',
      },
    });
    const results: any[] = [];
    for (const userWorkspaceClassItem of userWorkspaceClassData) {
      const timetables: Timetables[] = timetableExistLesson.filter(el => el.classId === userWorkspaceClassItem.classId);
      if (timetables.length) {
        results.push({
          ...userWorkspaceClassItem,
          timetables,
          total: timetables.length,
        });
      }
    }
    return {
      data: results,
      total: results.length,
    };
  }
  public async getUserWorkspaceByClassId(classId: number, search?: string) {
    let conditionUserWorkspaceClass: any = {
      classId,
    };
    if (search) {
      conditionUserWorkspaceClass = {
        ...conditionUserWorkspaceClass,
        userWorkspace: [
          {
            fullname: Like(`%${search}%`),
          },
          {
            nickname: Like(`%${search}%`),
          },
          {
            phoneNumber: Like(`%${search}%`),
          },
          {
            email: Like(`%${search}%`),
          },
        ],
      };
    }
    return UserWorkspaceClasses.find({
      where: conditionUserWorkspaceClass,
      relations: ['class', 'userWorkspace'],
    });
  }
}
