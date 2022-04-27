import { Account } from "@/models/accounts.model";
import { Service } from "typedi";
import { FindOptionsOrder, FindOptionsOrderValue } from "typeorm";

@Service()
export class AccountsService {
  public async findAll(
    page: number,
    limit: number,
    orderBy: FindOptionsOrderValue,
    search: string
  ) {
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
  public async create(item: Account) {
    const results = Account.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Account) {
    return Account.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Account.delete(id);
  }
}
