import { DbConnection } from '@/database/dbConnection';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { PermissionKeys, Permissions } from '@/models/permissions.model';

const main = async () => {
  /**
   * run: node ./dist/commands/setup-configs.command.js
   */
  await DbConnection.createConnection();
  const connection = await DbConnection.getConnection();
  if (connection) {
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(Permissions).insert([
        {
          key: PermissionKeys.TEACHER,
        },
        {
          key: PermissionKeys.STUDENT,
        },
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Exception(ExceptionName.SERVER_ERROR, ExceptionCode.SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
  process.exit();
};

main();
