import { Courses } from '@/models/courses.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class CoursesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Courses.findByCond({
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
    return Courses.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Courses) {
    const results = Courses.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Courses) {
    return Courses.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Courses.delete(id);
  }
}