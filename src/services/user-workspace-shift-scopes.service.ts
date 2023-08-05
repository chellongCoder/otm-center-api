import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CheckShiftClassroomDto } from '@/dtos/check-shift-classroom.dto';
import { Shifts } from '@/models/shifts.model';
import { CreateUserWorkspaceShiftScopeDto } from '@/dtos/create-user-workspace-shift-scope.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Courses } from '@/models/courses.model';

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
    console.log('chh_log ---> createValidate ---> shiftData:', shiftData);
    console.log('chh_log ---> createValidate ---> shiftData:', shiftData?.shiftWeekdays);
    console.log('chh_log ---> createValidate ---> item:', item);
    // const results = await UserWorkspaceShiftScopes.insert(item);
    // return results;
    return true;
  }

  /**
   * validate shift classrooms
   */
  public async checkShiftClassrooms(item: CheckShiftClassroomDto) {
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
