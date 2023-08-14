import moment from 'moment-timezone';
import { UserWorkspaceClassTypes, UserWorkspaceClasses } from '@/models/user-workspace-classes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { LessThan } from 'typeorm';

@Service()
export class UserWorkspaceClassesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaceClasses.findByCond({
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
    return UserWorkspaceClasses.findOne({
      where: {
        id,
      },
    });
  }
  /**
   * findByFilter
   */
  public async findByFilter(userWorkspaceId: number, status: UserWorkspaceClassTypes) {
    return UserWorkspaceClasses.find({
      where: {
        userWorkspaceId,
        status,
      },
      relations: ['class', 'workspace', 'class.course'],
    });
  }

  /**
   * create
   */
  public async create(item: UserWorkspaceClasses) {
    const results = await UserWorkspaceClasses.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: UserWorkspaceClasses) {
    return UserWorkspaceClasses.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaceClasses.delete(id);
  }

  public async getTimetableByDate({ userWorkspaceId, date, workspaceId }: { userWorkspaceId: number; date: number; workspaceId: number }) {
    console.log('chh_log ---> getTimetableByDate ---> workspaceId:', workspaceId);
    console.log('chh_log ---> getTimetableByDate ---> userWorkspaceId:', userWorkspaceId);
    const checkDate = moment(date, 'YYYYMMDD').toDate();
    const userWorkspaceClassData = await UserWorkspaceClasses.find({
      where: {
        userWorkspaceId,
        workspaceId,
        fromDate: LessThan(checkDate),
      },
    });
    console.log('chh_log ---> getTimetableByDate ---> userWorkspaceClassData:', userWorkspaceClassData);
    console.log('chh_log ---> getTimetableByDate ---> checkDate:', checkDate);
    return true;
  }
}
