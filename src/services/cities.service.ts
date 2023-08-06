import { Cities } from '@/models/cities.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class CitiesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Cities.findByCond({
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
    return Cities.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Cities) {
    const results = await Cities.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Cities) {
    return Cities.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Cities.delete(id);
  }
}
