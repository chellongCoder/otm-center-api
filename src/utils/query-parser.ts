import { FilterItem } from '@/interfaces/filter-item.interface';
import { OrderCond } from '@/interfaces/order-cond.interface';

export class QueryParser {
  static toFilters(search: string): FilterItem[] {
    if (search) {
      const conds = search.split(';');
      return conds.map(item => ({
        key: item.split(':')[0],
        opt: item.split(':')[1],
        value: item.split(':')[2],
      }));
    }
    return [];
  }
  static toOrderCond(data: string): OrderCond {
    return {
      sort: data.split(':')[0],
      order: data.split(':')[1].toUpperCase(),
    };
  }
}
