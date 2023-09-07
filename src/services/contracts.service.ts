import { Contracts } from '@/models/contracts.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreateContractDto } from '@/dtos/create-contract.dto';
import { DbConnection } from '@/database/dbConnection';

@Service()
export class ContractsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Contracts.findByCond({
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
    return Contracts.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateContractDto, userWorkspaceId: number, workspaceId: number) {
    // WIP - 02:11 08/09/2023
    // const connection = await DbConnection.getConnection();
    // if (connection) {
    //   const queryRunner = connection.createQueryRunner();
    //   await queryRunner.connect();
    //   await queryRunner.startTransaction();
    //   try {
    //     const evaluationCriteriaCreate = await queryRunner.manager.getRepository(EvaluationCriterias).insert({
    //       name: item.name,
    //       type: item.type,
    //       isActive: item.isActive,
    //       dailyEvaluationId: item.dailyEvaluationId,
    //       workspaceId: item.workspaceId,
    //     });
    //     const bulkUpdateEvaluationOptionValues: Partial<EvaluationOptionValues>[] = [];
    //     for (const evaluationOptionValueItem of item.evaluationOptionValues) {
    //       if (evaluationOptionValueItem.value) {
    //         const evaluationOptionValueCreate = new EvaluationOptionValues();
    //         evaluationOptionValueCreate.value = evaluationOptionValueItem.value;
    //         evaluationOptionValueCreate.evaluationCriteriaId = evaluationCriteriaCreate.identifiers[0].id;
    //         evaluationOptionValueCreate.workspaceId = item.workspaceId;
    //         bulkUpdateEvaluationOptionValues.push(evaluationOptionValueCreate);
    //       }
    //     }
    //     await queryRunner.manager.getRepository(EvaluationOptionValues).insert(bulkUpdateEvaluationOptionValues);
    //     await queryRunner.commitTransaction();
    //   } catch (error) {
    //     await queryRunner.rollbackTransaction();
    //     throw error;
    //   } finally {
    //     await queryRunner.release();
    //   }
    // }
    return true;
  }

  /**
   * update
   */
  public async update(id: number, item: Contracts) {
    return Contracts.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Contracts.delete(id);
  }
}
