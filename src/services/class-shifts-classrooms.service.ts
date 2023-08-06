import { ClassShiftsClassrooms } from '@/models/class-shifts-classrooms.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { CheckShiftClassroomValidDto } from '@/dtos/check-shift-classroom-valid.dto';
import { CreateShiftsClassroomsDto } from '@/dtos/create-class-shifts-classrooms.dto';
import { Shifts } from '@/models/shifts.model';
import { Classrooms } from '@/models/classrooms.model';
import { Classes } from '@/models/classes.model';
import { Workspaces } from '@/models/workspaces.model';

@Service()
export class ClassShiftsClassroomsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await ClassShiftsClassrooms.findByCond({
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
    return ClassShiftsClassrooms.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: CreateShiftsClassroomsDto) {
    const workspaceData = await Workspaces.findOne({ where: { id: item.workspaceId } });
    if (!workspaceData) {
      throw new Exception(ExceptionName.WORKSPACE_NOT_FOUND, ExceptionCode.WORKSPACE_NOT_FOUND);
    }
    const classData = await Classes.findOne({
      where: {
        id: item.classId,
        workspaceId: item.workspaceId,
      },
    });
    if (!classData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }
    const classroomData = await Classrooms.findOne({
      where: {
        id: item.classroomId,
        workspaceId: item.workspaceId,
      },
    });
    if (!classroomData?.id) {
      throw new Exception(ExceptionName.CLASSROOM_NOT_FOUND, ExceptionCode.CLASSROOM_NOT_FOUND);
    }
    const shiftData = await Shifts.findOne({
      where: {
        id: item.shiftId,
        workspaceId: item.workspaceId,
      },
    });
    if (!shiftData?.id) {
      throw new Exception(ExceptionName.SHIFT_NOT_FOUND, ExceptionCode.SHIFT_NOT_FOUND);
    }
    const classShiftsClassroom = new ClassShiftsClassrooms();
    classShiftsClassroom.shiftId = shiftData.id;
    classShiftsClassroom.classroomId = classroomData.id;
    classShiftsClassroom.classId = classData.id;
    classShiftsClassroom.workspaceId = workspaceData.id;
    classShiftsClassroom.validDate = item.validDate;
    const results = await ClassShiftsClassrooms.insert(classShiftsClassroom);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: ClassShiftsClassrooms) {
    return ClassShiftsClassrooms.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return ClassShiftsClassrooms.delete(id);
  }
  public async checkShiftClassroomValid(item: CheckShiftClassroomValidDto) {
    console.log('chh_log ---> checkShiftClassroomValid ---> item:', item);
    return true;
  }
}
