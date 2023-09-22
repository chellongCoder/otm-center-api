import { FavoriteUserWorkspaces } from '@/models/favorite-user-workspaces.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreateFavoriteDto } from '@/dtos/create-favorite.dto';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';

@Service()
export class FavoriteUserWorkspacesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await FavoriteUserWorkspaces.findByCond({
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
    return FavoriteUserWorkspaces.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateFavoriteDto, userWorkspaceData: UserWorkspaces) {
    const conditionQuery: any = {
      userWorkspaceId: userWorkspaceData.id,
    };
    if (item?.postId) {
      conditionQuery['postId'] = item.postId;
    } else if (item?.announcementId) {
      conditionQuery['announcementId'] = item.announcementId;
    } else {
      throw new Exception(ExceptionName.VALIDATE_FAILED, ExceptionCode.VALIDATE_FAILED);
    }
    const favoriteUserWorkspaceData = await FavoriteUserWorkspaces.findOne({
      where: conditionQuery,
    });
    if (favoriteUserWorkspaceData && favoriteUserWorkspaceData.id) {
      return FavoriteUserWorkspaces.delete(favoriteUserWorkspaceData.id);
    }
    const newFavoriteUserWorkspaces = new FavoriteUserWorkspaces();
    newFavoriteUserWorkspaces.userWorkspaceId = userWorkspaceData.id;
    newFavoriteUserWorkspaces.workspaceId = userWorkspaceData.workspaceId;
    if (item?.postId) {
      newFavoriteUserWorkspaces.postId = item.postId;
    } else if (item?.announcementId) {
      newFavoriteUserWorkspaces.announcementId = item.announcementId;
    }
    return FavoriteUserWorkspaces.insert(newFavoriteUserWorkspaces);
  }

  /**
   * update
   */
  public async update(id: number, item: FavoriteUserWorkspaces) {
    return FavoriteUserWorkspaces.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return FavoriteUserWorkspaces.delete(id);
  }
}
