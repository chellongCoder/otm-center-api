import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CheckShiftClassroomDto } from '@/dtos/check-shift-classroom.dto';

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
