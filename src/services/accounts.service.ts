import { Constant } from '@/constants';
import { Account } from '@/models/accounts.model';
import { ActiveAccountDto } from '@/dtos/active-account.dto';
import { NewAccountDto } from '@/dtos/new-account.dto';
import { SendGridClient } from '@/utils/sendgrid';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';

@Service()
export class AccountsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredAccounts = await Account.findByCond({
      sort: orderCond.sort,
      order: orderCond.order,
      skip: (page - 1) * limit,
      take: limit,
      cache: false,
      search: QueryParser.toFilters(search),
    });
    return {
      data: filteredAccounts[0],
      total: filteredAccounts[1],
      pages: Math.ceil(filteredAccounts[1] / limit),
    };
  }

  /**
   * findById
   */
  public async findById(id: number) {
    return Account.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: NewAccountDto) {
    const acc: Account = new Account();
    acc.email = item.email;
    acc.name = item.name;
    acc.password = '';
    const results = await Account.insert(acc);
    const mailClient = new SendGridClient();
    await mailClient.sendActiveAccountEmail(item.email, {
      link: `${Constant.ACTIVE_ACCOUNT_REDIRECT_URL}?id=${results.generatedMaps[0].id}`,
    });
    return results.generatedMaps[0];
  }

  /**
   * update
   */
  public async update(id: number, item: Account) {
    return Account.update(id, item);
  }

  /**
   * active
   */
  public async active(id: number, params: ActiveAccountDto) {
    const acc = await Account.findById(id);
    if (acc) {
      acc.password = params.password;
      acc.status = 1;
      return await acc.save();
    }
    return null;
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Account.delete(id);
  }
}
