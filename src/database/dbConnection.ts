import { logger } from "@/utils/logger";
import { DataSource } from "typeorm";
import config from "./ormconfig";

export class DbConnection {
  public static async createConnection() {
    try {
      const appDataSource = new DataSource(config);
      appDataSource.initialize()
        .then(() => {
          logger.info("Database connected!");
        })
        .catch((error) => logger.error(JSON.stringify(error)));
      return appDataSource;
    } catch (err) {
      logger.error(JSON.stringify(err));
    }
    return null;
  }
}
