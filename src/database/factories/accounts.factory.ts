import { Faker } from '@faker-js/faker';

import { define } from 'typeorm-seeding';
import { Account } from '../../models/accounts.model';

define(Account, (faker: Faker) => {
  const randName = faker.name.findName();
  const randPhone = faker.phone.phoneNumber();
  const randEmail = faker.internet.email();
  const account = new Account();
  account.name = randName;
  account.email = randEmail.toLowerCase();
  account.phone = randPhone;
  account.password = '123';
  return account;
});
