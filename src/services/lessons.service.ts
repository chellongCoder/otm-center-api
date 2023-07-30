import { Lessons } from '@/models/lessons.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class LessonsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Lessons.findByCond({
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
    return Lessons.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Lessons) {
    const results = await Lessons.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Lessons) {
    return Lessons.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Lessons.delete(id);
  }
}
