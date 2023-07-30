import { Events } from '@/models/events.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class EventsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Events.findByCond({
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
    return Events.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Events) {
    const results = await Events.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Events) {
    return Events.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Events.delete(id);
  }
}
