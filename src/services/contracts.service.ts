import { Contracts } from '@/models/contracts.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CreateContractDto } from '@/dtos/create-contract.dto';
import { DbConnection } from '@/database/dbConnection';
import { ContractCourses } from '@/models/contract-courses.model';
import { Courses } from '@/models/courses.model';
import { In } from 'typeorm';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';

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
      relations: ['contractCourses', 'contractCourses.course', 'contractCourses.contract'],
    });
  }
  public async getListContracts(userWorkspaceId: number, workspaceId: number) {
    return Contracts.find({
      where: {
        userWorkspaceId,
        workspaceId,
      },
      relations: ['contractCourses', 'contractCourses.course', 'contractCourses.contract'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateContractDto, userWorkspaceId: number, workspaceId: number) {
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const contractCreate = await queryRunner.manager.getRepository(Contracts).insert({
          userWorkspaceId: item.userWorkspaceId,
          code: item.code,
          paidMoney: item.paidMoney,
          workspaceId: workspaceId,
          createdByUserWorkspaceId: userWorkspaceId,
        });
        const courseData = await Courses.find({
          where: {
            id: In(item.contractCourses.map(el => el.courseId)),
          },
        });
        const bulkUpdateContractCourses: Partial<ContractCourses>[] = [];
        for (const contractCourseItem of item.contractCourses) {
          const courseItem = courseData.find(el => el.id === contractCourseItem.courseId);
          if (!courseItem?.id) {
            throw new Exception(ExceptionName.COURSE_NOT_FOUND, ExceptionCode.COURSE_NOT_FOUND);
          }
          const contractCourseCreate = new ContractCourses();
          contractCourseCreate.contractId = contractCreate.identifiers[0].id;
          contractCourseCreate.courseId = courseItem.id;
          contractCourseCreate.price = courseItem.price;
          contractCourseCreate.discount = contractCourseItem.discount;
          contractCourseCreate.workspaceId = workspaceId;
          bulkUpdateContractCourses.push(contractCourseCreate);
        }
        await queryRunner.manager.getRepository(ContractCourses).insert(bulkUpdateContractCourses);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
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
