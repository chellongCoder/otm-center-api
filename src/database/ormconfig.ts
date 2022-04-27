import { Account } from "@/models/accounts.model";
import { RecoveryCodes } from "@/models/recoveryCodes.model";
import { RefreshToken } from "@/models/refreshTokens.model";
import config from "config";

import { DataSourceOptions } from "typeorm";

export default {
  type: "postgres",
  host: config.get('dbConfig.host') || process.env.DB_HOST,
  port: config.get('dbConfig.port') || process.env.DB_PORT,
  username: config.get('dbConfig.user') || process.env.DB_USER,
  password: config.get('dbConfig.password') || process.env.DB_PASS,
  database: config.get('dbConfig.database') || process.env.DB_DBNAME,
  synchronize: config.get('dbConfig.synchronize') || false,
  logging: config.get('dbConfig.logging') || false,
  // COMMENT FOR SEED
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_DBNAME,
  // synchronize: false,
  // logging: false,
  entities: [Account, RefreshToken, RecoveryCodes],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  migrations: ["src/database/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "database/migrations",
    subscribersDir: "src/subscriber",
  },
} as DataSourceOptions;
