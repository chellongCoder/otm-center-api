import { NotificationStatus, UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';

@Service()
export class UserWorkspaceNotificationsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaceNotifications.findByCond({
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
    return UserWorkspaceNotifications.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: UserWorkspaceNotifications) {
    const results = await UserWorkspaceNotifications.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, userWorkspaceId: number, workspaceId: number) {
    const userWorkspaceNotificationData = await UserWorkspaceNotifications.findOne({
      where: {
        id,
        receiverUserWorkspaceId: userWorkspaceId,
        workspaceId,
      },
    });
    if (!userWorkspaceNotificationData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    return UserWorkspaceNotifications.update(id, {
      status: NotificationStatus.SEEN,
    });
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaceNotifications.delete(id);
  }
  public async getListNotification(userWorkspaceId: number, workspaceId: number, page = 1, limit = 10) {
    const [resultData, total] = await UserWorkspaceNotifications.findAndCount({
      where: {
        receiverUserWorkspaceId: userWorkspaceId,
        workspaceId,
      },
      relations: ['senderUserWorkspace', 'receiverUserWorkspace'],
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: resultData,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
