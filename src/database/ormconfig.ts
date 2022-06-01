import config from 'config';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

export default {
  type: 'postgres',
  host: config.get('dbConfig.host') || process.env.DB_HOST,
  port: config.get('dbConfig.port') || process.env.DB_PORT,
  username: config.get('dbConfig.user') || process.env.DB_USER,
  password: config.get('dbConfig.password') || process.env.DB_PASS,
  database: config.get('dbConfig.database') || process.env.DB_DBNAME,
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
  entities: [path.join(__dirname, '../../src/models/**/*{.ts,.js}')],
  seeds: [path.join(__dirname, '../../src/database/seeds/**/*{.ts,.js}')],
  factories: [path.join(__dirname, '../../src/database/factories/**/*{.ts,.js}')],
  migrations: [path.join(__dirname, '../../src/database/migrations/**/*.ts')],
  subscribers: [path.join(__dirname, '../../src/subscriber/**/*.ts')],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'database/migrations',
    subscribersDir: 'src/subscriber',
  },
} as DataSourceOptions;
