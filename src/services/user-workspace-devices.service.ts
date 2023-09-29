import { UserWorkspaceDevices } from '@/models/user-workspace-devices.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { UserWorkspaces } from '@/models/user-workspaces.model';

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
  public async create(item: Partial<UserWorkspaceDevices>, userWorkspaceData: UserWorkspaces) {
    if (item?.deviceId) {
      const existDeviceData = await UserWorkspaceDevices.findOne({
        where: {
          workspaceId: userWorkspaceData.workspaceId,
          userWorkspaceId: userWorkspaceData.id,
          deviceId: item.deviceId,
        },
      });
      if (existDeviceData?.id) {
        if (existDeviceData.deviceId === item.deviceId && existDeviceData.playerId === item.playerId) {
          return;
        }
        await UserWorkspaceDevices.softRemove(existDeviceData);
        const results = await UserWorkspaceDevices.insert({
          ...item,
          userWorkspaceId: userWorkspaceData.id,
          workspaceId: userWorkspaceData.workspaceId,
        });
        return results;
      }
      const results = await UserWorkspaceDevices.insert({
        ...item,
        userWorkspaceId: userWorkspaceData.id,
        workspaceId: userWorkspaceData.workspaceId,
      });
      return results;
    }
    return;
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
