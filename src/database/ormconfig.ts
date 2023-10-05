import config from 'config';
import path from 'path';
import { DataSourceOptions } from 'typeorm';
/**
 *
 */
console.log('__dirname', __dirname);
export default {
  type: 'postgres',
  host: process.env.DB_HOST || config.get('dbConfig.host'),
  port: process.env.DB_PORT || config.get('dbConfig.port'),
  username: process.env.DB_USER || config.get('dbConfig.user'),
  password: process.env.DB_PASS || config.get('dbConfig.password'),
  database: process.env.DB_DBNAME || config.get('dbConfig.database'),
  synchronize: false,
  logging: false,
  // // COMMENT FOR SEED
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_DBNAME,
  // synchronize: false,
  // logging: false,
  // =======================
  entities: [__dirname + '/../*.model.{js,ts}'],
  seeds: ['src/database/seeds/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/subscriber/*.ts'],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/subscriber',
  },
  logger: 'advanced-console',
} as DataSourceOptions;
