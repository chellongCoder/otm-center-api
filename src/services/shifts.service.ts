import { Shifts } from '@/models/shifts.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { CreateShiftDto } from '@/dtos/create-shift.dto';
import _ from 'lodash';
import moment from 'moment-timezone';

@Service()
export class ShiftsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Shifts.findByCond({
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
    return Shifts.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateShiftDto) {
    if (Number(item.fromTime) >= Number(item.toTime)) {
      throw new Exception(ExceptionName.SHIFT_TIME_INPUT_INVALID, ExceptionCode.SHIFT_TIME_INPUT_INVALID);
    }
    if (!item.isEveryday && !item.weekdays?.length) {
      throw new Exception(ExceptionName.SHIFT_WEEKDAY_REQUIRE, ExceptionCode.SHIFT_WEEKDAY_REQUIRE);
    }
    let dayOfWeekLoop: number[] = [];
    if (item.isEveryday) {
      dayOfWeekLoop = [1, 2, 3, 4, 5, 6, 0];
    } else {
      dayOfWeekLoop = _.uniq(item.weekdays);
    }
    const bulkCreateShifts: Shifts[] = [];
    for (const weekday of dayOfWeekLoop) {
      const shiftCreate = new Shifts();
      shiftCreate.fromTime = moment(item.fromTime, 'HHmmss').toDate();
      shiftCreate.toTime = moment(item.toTime, 'HHmmss').toDate();
      shiftCreate.weekday = weekday;
      shiftCreate.workspaceId = item.workspaceId;

      bulkCreateShifts.push(shiftCreate);
    }
    return await Shifts.insert(bulkCreateShifts);
  }

  /**
   * update
   */
  public async update(id: number, item: Shifts) {
    return Shifts.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Shifts.delete(id);
  }
}
