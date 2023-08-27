import { ApplianceAbsents } from '@/models/appliance-absents.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { DbConnection } from '@/database/dbConnection';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { Timetables } from '@/models/timetables.model';
import { In } from 'typeorm';
import { ApplianceAbsentTimetables } from '@/models/appliance-absent-timetables.model';
import { ApplianceAbsentsDto } from '@/dtos/create-appliance-absent.dto';

@Service()
export class ApplianceAbsentsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await ApplianceAbsents.findByCond({
      sort: orderCond.sort,
      order: orderCond.order,
      skip: (page - 1) * limit,
      take: limit,
      cache: false,
      search: QueryParser.toFilters(search),
    });
    return {
      data: filteredData[0],
      total: filteredData[1],
      pages: Math.ceil(filteredData[1] / limit),
    };
  }

  /**
   * findById
   */
  public async findById(id: number) {
    return ApplianceAbsents.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: ApplianceAbsentsDto, userWorkspaceId: number, workspaceId: number) {
    const timetableData = await Timetables.find({
      where: {
        id: In(item.timetableIds),
      },
    });
    if (!timetableData.length) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const applianceAbsentDataExist = await ApplianceAbsents.find({
      where: {
        userWorkspaceId: userWorkspaceId,
        workspaceId: workspaceId,
        // status: In(AbsentStatus.APPROVED, AbsentStatus.NOT_APPROVED_YET, AbsentStatus.CANCEL),
        applianceAbsentTimetables: {
          timetableId: In(item.timetableIds),
        },
      },
    });
    if (applianceAbsentDataExist && applianceAbsentDataExist.length) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const newAppliance = await queryRunner.manager.getRepository(ApplianceAbsents).insert({
          userWorkspaceId: userWorkspaceId,
          note: item.note,
          workspaceId: workspaceId,
        });
        const bulkCreateApplianceAbsentTimetables: ApplianceAbsentTimetables[] = [];
        for (const timetableItem of timetableData) {
          const newApplianceTimetable = new ApplianceAbsentTimetables();
          newApplianceTimetable.timetableId = timetableItem.id;
          newApplianceTimetable.applianceAbsentId = newAppliance.identifiers[0]?.id;
          newApplianceTimetable.workspaceId = workspaceId;
          bulkCreateApplianceAbsentTimetables.push(newApplianceTimetable);
        }
        await queryRunner.manager.getRepository(ApplianceAbsentTimetables).insert(bulkCreateApplianceAbsentTimetables);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Exception(ExceptionName.SERVER_ERROR, ExceptionCode.SERVER_ERROR);
      } finally {
        await queryRunner.release();
        return true;
      }
    } else throw new Exception(ExceptionName.SERVICE_CONNECT_FAIL, ExceptionCode.SERVICE_CONNECT_FAIL);
  }

  /**
   * update
   */
  public async update(id: number, item: ApplianceAbsents) {
    return ApplianceAbsents.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return ApplianceAbsents.delete(id);
  }
}
