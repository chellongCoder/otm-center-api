import { AssignmentSkills } from '@/models/assignment-skills.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class AssignmentSkillsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await AssignmentSkills.findByCond({
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
    return AssignmentSkills.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: AssignmentSkills) {
    const results = AssignmentSkills.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: AssignmentSkills) {
    return AssignmentSkills.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return AssignmentSkills.delete(id);
  }
}
