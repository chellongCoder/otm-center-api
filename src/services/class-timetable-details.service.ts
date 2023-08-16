import { ClassTimetableDetails } from '@/models/class-timetable-details.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { UpdateFinishAssignmentDto } from '@/dtos/updateFinishAssignment.dto';
import { Timetables } from '@/models/timetables.model';
import { Like } from 'typeorm';
import { UpdateStudentAttendanceDto } from '@/dtos/updateStudentAttentdance.dto';

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
  public async studentAttendance(item: UpdateStudentAttendanceDto) {
    console.log('chh_log ---> item:', item);
  }
}
