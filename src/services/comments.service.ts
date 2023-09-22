import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreateCommentsDto } from '@/dtos/create-comments.dto';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { UpdateCommentsDto } from '@/dtos/update-comments.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';

@Service()
export class CommentsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Comments.findByCond({
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
   * getListComments
   */
  public async getListComments(targetKey: string, category: CategoriesCommentsEnum, workspaceId: number) {
    return Comments.find({
      where: {
        targetKey,
        workspaceId,
        category,
      },
      relations: ['rootComment', 'subComments', 'userWorkspace', 'subComments.userWorkspace'],
      order: {
        createdAt: 'ASC',
        subComments: {
          createdAt: 'ASC',
        },
      },
    });
  }

  /**
   * findById
   */
  public async findById(id: number) {
    return Comments.findOne({
      where: {
        id,
      },
      relations: ['rootComment', 'subComments', 'userWorkspace'],
      order: {
        createdAt: 'ASC',
        subComments: {
          createdAt: 'ASC',
        },
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateCommentsDto, userWorkspaceData: UserWorkspaces) {
    const results = await Comments.insert({
      ...item,
      userWorkspaceId: userWorkspaceData.id,
      workspaceId: userWorkspaceData.workspaceId,
    });
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: UpdateCommentsDto, userWorkspaceData: UserWorkspaces) {
    const commentData = await Comments.findOne({
      where: {
        id,
        userWorkspaceId: userWorkspaceData.id,
      },
    });
    if (!commentData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    if (commentData.userWorkspaceId === userWorkspaceData.id) {
      return Comments.update(id, item);
    } else {
      throw new Exception(ExceptionName.PERMISSION_DENIED, ExceptionCode.PERMISSION_DENIED);
    }
  }

  /**
   * delete
   */
  public async delete(id: number, userWorkspaceId: number) {
    const commentData = await Comments.findOne({ where: { id } });
    if (!commentData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    if (commentData.userWorkspaceId === userWorkspaceId) {
      return Comments.softRemove(commentData);
    } else {
      throw new Exception(ExceptionName.PERMISSION_DENIED, ExceptionCode.PERMISSION_DENIED);
    }
  }
}
