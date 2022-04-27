import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Account } from '../../models/accounts.model'

// create-account.seed.ts
export default class CreateAccounts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userAccount = new Account();
    userAccount.name = 'user01';
    userAccount.email = 'user01@gmail.com';
    userAccount.password = '123@';
    userAccount.phone = '0912244567';
    await userAccount.save();
  }
}