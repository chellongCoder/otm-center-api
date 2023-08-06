import config from 'config';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

export default {
  type: 'postgres',
  host: process.env.DB_HOST || config.get('dbConfig.host'),
  port: process.env.DB_PORT || config.get('dbConfig.port'),
  username: process.env.DB_USER || config.get('dbConfig.user'),
  password: process.env.DB_PASS || config.get('dbConfig.password'),
  database: process.env.DB_DBNAME || config.get('dbConfig.database'),
  synchronize: config.get('dbConfig.synchronize') || false,
  logging: config.get('dbConfig.logging') || false,
  // // COMMENT FOR SEED
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_DBNAME,
  // synchronize: false,
  // logging: false,
  // =======================
  entities: [path.join(__dirname, '../models/**/*{.ts,.js}')],
  seeds: [path.join(__dirname, '../database/seeds/**/*{.ts,.js}')],
  factories: [path.join(__dirname, '../database/factories/**/*{.ts,.js}')],
  migrations: [path.join(__dirname, '../database/migrations/**/*.ts')],
  subscribers: [path.join(__dirname, '../subscriber/**/*.ts')],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'database/migrations',
    subscribersDir: 'src/subscriber',
  },
} as DataSourceOptions;
