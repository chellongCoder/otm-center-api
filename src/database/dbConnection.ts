import { logger } from '@/utils/logger';
import { DataSource } from 'typeorm';
import config from './ormconfig';

export class DbConnection {
  static appDataSource: DataSource;

  public static async getConnection() {
    if (this.appDataSource) return this.appDataSource;
    return null;
  }

  public static async createConnection() {
    try {
      logger.info(JSON.stringify(config));
      this.appDataSource = new DataSource(config);
      this.appDataSource
        .initialize()
        .then(() => {
          logger.info('Database connected!');
        })
        .catch(error => logger.error(`Connect Db Error: ${JSON.stringify(error)}`));
      return this.appDataSource;
    } catch (err) {
      logger.error(`Connect Error ${JSON.stringify(err)}`);
    }
    return null;
  }
}
