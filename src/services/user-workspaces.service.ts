import { UserWorkspaceTypes, UserWorkspaces } from '@/models/user-workspaces.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { UpdateUserWorkspaceDto } from '@/dtos/update-user-workspace.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { DbConnection } from '@/database/dbConnection';
import { PermissionKeys, Permissions } from '@/models/permissions.model';
import { UserWorkspacePermissions } from '@/models/user-workspace-permissions.model';
import moment from 'moment-timezone';
import { BodyPushNotificationDtoDto } from '@/dtos/body-push-notification.dto';
import { SendMessageNotificationRabbit, sendNotificationToRabbitMQ } from '@/utils/rabbit-mq.util';
import { AbsentStatus, ApplianceAbsents } from '@/models/appliance-absents.model';
import { Posts } from '@/models/posts.model';
import { Announcements } from '@/models/announcements.model';

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
      relations: ['workspace'],
    });
  }

  /**
   * create
   */
  public async create(item: UserWorkspaces) {
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const userWorkspaceCreate = await queryRunner.manager.getRepository(UserWorkspaces).insert(item);
        const userWorkspacePermissionCreate = new UserWorkspacePermissions();
        userWorkspacePermissionCreate.userWorkspaceId = userWorkspaceCreate.identifiers[0]?.id;
        userWorkspacePermissionCreate.validDate = moment().toDate();
        userWorkspacePermissionCreate.workspaceId = item.workspaceId;
        const permissionData = await Permissions.find();

        switch (item.userWorkspaceType) {
          case UserWorkspaceTypes.STAFF: {
            const permissionItem = permissionData.find(el => el.key === PermissionKeys.STAFF);
            if (permissionItem) userWorkspacePermissionCreate.permissionId = permissionItem.id;
            break;
          }
          case UserWorkspaceTypes.TEACHER: {
            const permissionItem = permissionData.find(el => el.key === PermissionKeys.TEACHER);
            if (permissionItem) userWorkspacePermissionCreate.permissionId = permissionItem.id;
            break;
          }
          case UserWorkspaceTypes.PARENT:
          case UserWorkspaceTypes.STUDENT: {
            const permissionItem = permissionData.find(el => el.key === PermissionKeys.STUDENT);
            if (permissionItem) userWorkspacePermissionCreate.permissionId = permissionItem.id;
            break;
          }
          default:
            break;
        }
        await queryRunner.manager.getRepository(UserWorkspacePermissions).insert(userWorkspacePermissionCreate);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
      return true;
    }
  }

  /**
   * update
   */
  public async update(id: number, item: UpdateUserWorkspaceDto) {
    const userWorkspaceData = await UserWorkspaces.findOne({ where: { id } });
    if (!userWorkspaceData) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_NOT_FOUND);
    }
    return UserWorkspaces.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaces.delete(id);
  }
  public async pushNotification(item: BodyPushNotificationDtoDto) {
    const data: SendMessageNotificationRabbit = {
      type: item.type,
      data: {
        category: item.category,
        id: item.id,
        detail: item.detail,
        content: item.content,
        playerIds: item.playerIds,
      },
    };
    await sendNotificationToRabbitMQ(data);
  }
  public async getNotification(userWorkspaceData: UserWorkspaces) {
    /**
     * Note: response:
     * absentAppliance: tổng đơn chưa được duyệt
     * post: tổng bài viết
     * announcement: tổng tin tức
     */
    const userWorkspaceId = userWorkspaceData.id;
    const workspaceId = userWorkspaceData.workspaceId;
    const absentAppliance = await ApplianceAbsents.count({
      where: {
        userWorkspaceId: userWorkspaceId,
        workspaceId: workspaceId,
        status: AbsentStatus.NOT_APPROVED_YET,
      },
    });
    const post = await Posts.count({
      where: {
        postUserWorkspaces: {
          userWorkspaceId,
        },
        workspaceId,
      },
    });
    const announcement = await Announcements.count({
      where: {
        announcementUserWorkspaces: {
          userWorkspaceId: userWorkspaceData.id,
        },
      },
    });
    return {
      absentAppliance: absentAppliance || 0,
      post: post || 0,
      announcement: announcement || 0,
    };
  }
}
