import { DailyEvaluations } from '@/models/daily-evaluations.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class DailyEvaluationsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await DailyEvaluations.findByCond({
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
    return DailyEvaluations.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: DailyEvaluations) {
    const results = await DailyEvaluations.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: DailyEvaluations) {
    return DailyEvaluations.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return DailyEvaluations.delete(id);
  }
}