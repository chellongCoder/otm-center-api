import moment from 'moment-timezone';
import { UserWorkspaceClassTypes, UserWorkspaceClasses, homeworkStatus } from '@/models/user-workspace-classes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { In, IsNull, LessThan, Not } from 'typeorm';
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
        id: item.id,
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
    status,
  }: {
    userWorkspaceId: number;
    workspaceId: number;
    status: homeworkStatus;
  }) {
    const userWorkspaceClassData = await UserWorkspaceClasses.find({
      where: {
        userWorkspaceId,
      },
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
    if (status === homeworkStatus.DONE) {
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
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
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
}
