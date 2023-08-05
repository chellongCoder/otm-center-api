import _ from 'lodash';
import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CheckShiftClassroomDto } from '@/dtos/check-shift-classroom.dto';
import { Shifts } from '@/models/shifts.model';
import { CreateUserWorkspaceShiftScopeDto, UserWorkspaceShiftScopesDto } from '@/dtos/create-user-workspace-shift-scope.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Courses } from '@/models/courses.model';
import { Workspaces } from '@/models/workspaces.model';
import { UserWorkspaceTypes, UserWorkspaces } from '@/models/user-workspaces.model';
import { In } from 'typeorm';
import { Classrooms } from '@/models/classrooms.model';
import { Classes } from '@/models/classes.model';

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
  public async createValidate(item: CreateUserWorkspaceShiftScopeDto) {
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
      relations: ['shiftWeekdays'],
    });
    if (!shiftData?.id) {
      throw new Exception(ExceptionName.SHIFT_NOT_FOUND, ExceptionCode.SHIFT_NOT_FOUND);
    }
    const courseData = await Courses.findOne({
      where: {
        id: item.courseId,
        workspaceId: item.workspaceId,
      },
    });
    if (!courseData?.id) {
      throw new Exception(ExceptionName.COURSE_NOT_FOUND, ExceptionCode.COURSE_NOT_FOUND);
    }
    if (!item.userWorkspaces.length) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_NOT_FOUND);
    }
    const userWorkspaceData: UserWorkspaceShiftScopesDto[] = _.uniq(item.userWorkspaces, 'userWorkspaceId');
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
    const bulkCreateShiftScopes: UserWorkspaceShiftScopes[] = [];
    for (const userWorkspaceItem of userWorkspaceData) {
      const userWorkspaceShiftScope = new UserWorkspaceShiftScopes();
      userWorkspaceShiftScope.workspaceId = workspaceData.id;
      userWorkspaceShiftScope.userWorkspaceId = userWorkspaceItem.userWorkspaceId;
      userWorkspaceShiftScope.courseId = courseData.id;
      userWorkspaceShiftScope.shiftId = shiftData.id;
      userWorkspaceShiftScope.classId = classData.id;
      userWorkspaceShiftScope.classroomId = classroomData.id;
      userWorkspaceShiftScope.validDate = item.validDate;
      userWorkspaceShiftScope.expiresDate = item.expiresDate;
      userWorkspaceShiftScope.title = userWorkspaceItem.title;
      userWorkspaceShiftScope.fromTime = userWorkspaceItem.fromTime;
      userWorkspaceShiftScope.toTime = userWorkspaceItem.toTime;
      userWorkspaceShiftScope.note = userWorkspaceItem.note;

      bulkCreateShiftScopes.push(userWorkspaceShiftScope);
    }
    return await UserWorkspaceShiftScopes.insert(bulkCreateShiftScopes);
  }

  /**
   * validate shift classrooms
   */
  public async checkShiftClassrooms(item: CheckShiftClassroomDto) {
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
}
