import { UserWorkspaceDevices } from '@/models/user-workspace-devices.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class UserWorkspaceDevicesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaceDevices.findByCond({
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
    return UserWorkspaceDevices.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Partial<UserWorkspaceDevices>, userWorkspaceId: number, workspaceId: number) {
    const userWorkspaceDeviceData = await UserWorkspaceDevices.findOne({
      where: {
        workspaceId,
        userWorkspaceId,
        playerId: item.playerId,
      },
    });
    if (!userWorkspaceDeviceData?.id) {
      const results = await UserWorkspaceDevices.insert({
        ...item,
        userWorkspaceId,
        workspaceId,
      });
      return results;
    }
    return true;
  }

  /**
   * update
   */
  public async update(id: number, item: UserWorkspaceDevices) {
    return UserWorkspaceDevices.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaceDevices.delete(id);
  }
}
