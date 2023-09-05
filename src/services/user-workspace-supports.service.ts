import { UserWorkspaceSupports } from '@/models/user-workspace-supports.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { UserWorkspaceSupportDto } from '@/dtos/create-user-workspace-support.dto';
import { PermissionKeys } from '@/models/permissions.model';
import { DbConnection } from '@/database/dbConnection';
import { UserWorkspaceSupportImages } from '@/models/user-workspace-support-images.model';

@Service()
export class UserWorkspaceSupportsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaceSupports.findByCond({
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
    return UserWorkspaceSupports.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: UserWorkspaceSupportDto, userWorkspaceId: number, workspaceId: number, type: PermissionKeys) {
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const userWorkspaceSupportCreate = await queryRunner.manager.getRepository(UserWorkspaceSupports).insert({
          ...item,
          type,
          userWorkspaceId,
          workspaceId,
        });
        if (item.images) {
          const bulkCreate: Partial<UserWorkspaceSupportImages>[] = [];
          for (const url of item.images) {
            const newCreate = new UserWorkspaceSupportImages();
            newCreate.url = url;
            newCreate.userWorkspaceSupportId = userWorkspaceSupportCreate.identifiers[0].id;
            newCreate.workspaceId = workspaceId;
            bulkCreate.push(newCreate);
          }
          await queryRunner.manager.getRepository(UserWorkspaceSupportImages).insert(bulkCreate);
        }
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
    return true;
  }
  /**
   * update
   */
  public async update(id: number, item: UserWorkspaceSupports) {
    return UserWorkspaceSupports.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaceSupports.delete(id);
  }
  public async getListByUserWorkspace(userWorkspaceId: number, workspaceId: number) {
    return UserWorkspaceSupports.find({
      where: {
        userWorkspaceId,
        workspaceId,
      },
      relations: ['userWorkspaceSupportImages'],
    });
  }
}
