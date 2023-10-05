import { Factory, Seeder } from 'typeorm-seeding';
import { Account } from '../../models/accounts.model';
import { Connection } from 'typeorm';

// create-account.seed.ts
export default class CreateAccounts implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Account)().createMany(100);
  }
}
