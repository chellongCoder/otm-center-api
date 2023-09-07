import { Invoices } from '@/models/invoices.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreateInvoiceDto } from '@/dtos/create-invoice.dto';
import moment from 'moment-timezone';

@Service()
export class InvoicesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Invoices.findByCond({
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
    return Invoices.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateInvoiceDto, userWorkspaceId: number, workspaceId: number) {
    const results = await Invoices.insert({
      ...item,
      date: moment().toDate(),
      createdByUserWorkspaceId: userWorkspaceId,
      workspaceId,
    });
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Invoices) {
    return Invoices.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Invoices.delete(id);
  }
  public async getListInvoices(userWorkspaceId: number, workspaceId: number) {
    return Invoices.find({
      where: {
        userWorkspaceId,
        workspaceId,
      },
    });
  }
}
