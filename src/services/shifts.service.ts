import { Shifts } from '@/models/shifts.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { CreateShiftDto } from '@/dtos/create-shift.dto';
import _ from 'lodash';
import { ShiftWeekdays } from '@/models/shift-weekdays.model';

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
    if (item.fromTime >= item.toTime) {
      throw new Exception(ExceptionName.SHIFT_TIME_INPUT_INVALID, ExceptionCode.SHIFT_TIME_INPUT_INVALID);
    }
    if (!item.isEveryday && !item.weekdays?.length) {
      throw new Exception(ExceptionName.SHIFT_WEEKDAY_REQUIRE, ExceptionCode.SHIFT_WEEKDAY_REQUIRE);
    }
    const shift = await Shifts.insert(item);
    if (item.weekdays && item.weekdays.length && !item.isEveryday) {
      const weekdays = _.uniq(item.weekdays);
      const bulkCreateShiftWeekdays: ShiftWeekdays[] = [];
      for (const weekday of weekdays) {
        const shiftWeekday = new ShiftWeekdays();
        shiftWeekday.shiftId = shift.identifiers[0]?.id;
        shiftWeekday.weekday = weekday;
        shiftWeekday.workspaceId = item.workspaceId;
        bulkCreateShiftWeekdays.push(shiftWeekday);
      }
      await ShiftWeekdays.insert(bulkCreateShiftWeekdays);
    }
    return shift;
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
