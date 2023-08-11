import { Classes, StatusClasses } from '@/models/classes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Timetables } from '@/models/timetables.model';

@Service()
export class ClassesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);

    const filteredData = await Classes.findByCond({
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

  public async findAllClasses(page = 1, limit = 10, order = 'id:asc', search: string, status: StatusClasses) {
    const orderCond = QueryParser.toOrderCond(order);

    const filteredData = await Classes.findByCond({
      sort: orderCond.sort,
      order: orderCond.order,
      skip: (page - 1) * limit,
      take: limit,
      cache: false,
      search: QueryParser.toFilters(search),
      relations: {
        course: true,
      },
      where: {
        status: status,
      },
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
    return Classes.findOne({
      where: {
        id,
      },
      relations: ['course', 'workspace'],
    });
  }

  /**
   * create
   */
  public async create(item: Classes) {
    const results = await Classes.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Classes) {
    return Classes.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Classes.delete(id);
  }
  public async getClassSchedule(id: number) {
    return await Timetables.find({
      where: {
        classId: id,
      },
      relations: [
        'class',
        'shift',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
      ],
      order: {
        sessionNumberOrder: 'ASC',
      },
    });
  }
}
