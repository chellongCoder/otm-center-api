import { Constant } from '@/constants';
import { Account } from '@/models/accounts.model';
import { ActiveAccountDto } from '@/dtos/active-account.dto';
import { NewAccountDto } from '@/dtos/new-account.dto';
import { SendGridClient } from '@/utils/sendgrid';
import { Service } from 'typedi';
import { FindOptionsOrderValue } from 'typeorm';

@Service()
export class AccountsService {
  public async findAll(page: number, limit: number, orderBy: FindOptionsOrderValue, search: any) {
    return Account.find({
      order: {
        id: orderBy,
      },
      skip: (page - 1) * limit,
      take: limit,
      cache: false,
    });
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
