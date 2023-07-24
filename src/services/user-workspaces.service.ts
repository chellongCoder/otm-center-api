import { UserWorkspaces } from '@/models/user-workspaces.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class UserWorkspacesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaces.findByCond({
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
    return UserWorkspaces.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: UserWorkspaces) {
    const results = UserWorkspaces.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: UserWorkspaces) {
    return UserWorkspaces.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaces.delete(id);
  }
}