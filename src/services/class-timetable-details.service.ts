import { ClassTimetableDetails } from '@/models/class-timetable-details.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { UpdateFinishAssignmentDto } from '@/dtos/updateFinishAssignment.dto';
import { Timetables } from '@/models/timetables.model';
import { Like } from 'typeorm';
import { UpdateStudentAttendanceDto } from '@/dtos/updateStudentAttentdance.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { DbConnection } from '@/database/dbConnection';
import moment from 'moment-timezone';
import { UpdateClassTimetableDetailMarkingDto } from '@/dtos/updateClassTimetableDetailMarking.dto';

@Service()
export class ClassTimetableDetailsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await ClassTimetableDetails.findByCond({
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
    return ClassTimetableDetails.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: ClassTimetableDetails) {
    const results = await ClassTimetableDetails.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: ClassTimetableDetails) {
    return ClassTimetableDetails.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return ClassTimetableDetails.delete(id);
  }
  public async finishAssignment(item: UpdateFinishAssignmentDto) {
    const classTimetableDetail = await ClassTimetableDetails.findOne({
      where: {
        userWorkspaceId: item.userWorkspaceId,
        workspaceId: item.workspaceId,
        timetableId: item.timetableId,
      },
    });
    if (!classTimetableDetail?.id) {
      const classTimetableDetailCreate = new ClassTimetableDetails();
      classTimetableDetailCreate.timetableId = item.timetableId;
      classTimetableDetailCreate.userWorkspaceId = item.userWorkspaceId;
      classTimetableDetailCreate.homeworkAssignment = item.assignment;
      classTimetableDetailCreate.workspaceId = item.workspaceId;
      return await ClassTimetableDetails.insert(classTimetableDetailCreate);
    }
    return await ClassTimetableDetails.update(classTimetableDetail.id, {
      ...classTimetableDetail,
      homeworkAssignment: item.assignment,
      homeworkAssignmentTime: moment().toDate(),
    });
  }

  public async getAttendances(timetableId: number, search?: string) {
    let condition: any = {
      id: timetableId,
    };
    if (search) {
      condition = {
        ...condition,
        classTimetableDetails: {
          userWorkspace: [
            {
              fullname: Like(`%${search}%`),
            },
            {
              nickname: Like(`%${search}%`),
            },
            {
              phoneNumber: Like(`%${search}%`),
            },
            {
              email: Like(`%${search}%`),
            },
          ],
        },
      };
    }
    return Timetables.findOne({
      where: condition,
      relations: ['classTimetableDetails', 'classTimetableDetails.userWorkspace'],
    });
  }
  public async updateClassTimetableDetailMarking(id: number, item: UpdateClassTimetableDetailMarkingDto) {
    const classTimetableDetailData = await ClassTimetableDetails.findOne({
      where: {
        id,
      },
    });
    if (!classTimetableDetailData?.id) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }
    return await ClassTimetableDetails.update(id, {
      homeworkAssessment: item.homeworkAssessment,
      homeworkScore: item.homeworkScore,
      homeworkByUserWorkspaceId: item.userWorkspaceId,
    });
  }
  public async updateStudentAttendance(item: UpdateStudentAttendanceDto) {
    const timeTableData = await Timetables.findOne({
      where: {
        id: item.timetableId,
      },
    });
    if (!timeTableData?.id) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }

    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        if (item.attendanceNote) {
          await queryRunner.manager.getRepository(Timetables).save({
            id: timeTableData.id,
            attendanceNote: item.attendanceNote,
          });
        }
        const classTimetableDetailData: ClassTimetableDetails[] = await ClassTimetableDetails.find({
          where: {
            timetableId: item.timetableId,
          },
        });
        const bulkUpdateClassTimetableDetail: Partial<ClassTimetableDetails>[] = [];
        for (const userWorkspaceAttendanceItem of item.userWorkspaceAttendances) {
          const classTimetableDetailItem = classTimetableDetailData.find(el => el.userWorkspaceId === userWorkspaceAttendanceItem.userWorkspaceId);
          if (classTimetableDetailItem?.id) {
            bulkUpdateClassTimetableDetail.push({
              id: classTimetableDetailItem.id,
              attendanceStatus: userWorkspaceAttendanceItem.status,
              attendanceNote: userWorkspaceAttendanceItem.note,
              attendanceByUserWorkspaceId: item.userWorkspaceId,
            });
          }
        }
        await queryRunner.manager.getRepository(ClassTimetableDetails).save(bulkUpdateClassTimetableDetail);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Exception(ExceptionName.SERVER_ERROR, ExceptionCode.SERVER_ERROR);
      } finally {
        await queryRunner.release();
      }
    }
  }
}
