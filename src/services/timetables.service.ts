import { Lectures } from '@/models/lectures.model';
import { Timetables } from '@/models/timetables.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { GenerateTimetableDto } from '@/dtos/generate-timetable.dto';
import { Classes } from '@/models/classes.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import { Lessons } from '@/models/lessons.model';
import { ClassShiftsClassrooms } from '@/models/class-shifts-classrooms.model';

@Service()
export class TimetablesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Timetables.findByCond({
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
    return Timetables.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Timetables) {
    const results = await Timetables.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: Timetables) {
    return Timetables.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Timetables.delete(id);
  }
  /**
   * generate timetable
   */
  public async generate(item: GenerateTimetableDto) {
    const classData = await Classes.findOne({
      where: {
        id: item.classId,
        workspaceId: item.workspaceId,
      },
      relations: ['course'],
    });
    console.log('chh_log ---> generate ---> classData:', classData);
    if (!classData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }
    const numberOfLesson: number = classData.sessionNumber;
    console.log('chh_log ---> generate ---> numberOfLesson:', numberOfLesson);
    console.log('chh_log ---> generate ---> classData.fromTime:', classData.fromTime);
    const ClassShiftsClassroomData = await ClassShiftsClassrooms.find({
      where: {
        workspaceId: item.workspaceId,
        classId: classData.id,
      },
      relations: ['shift'],
    });
    console.log('chh_log ---> generate ---> ClassShiftsClassroomData:', ClassShiftsClassroomData);
    // const lessonsData = await Lessons.find({
    //   where: {
    //     workspaceId: item.workspaceId,
    //     courseId: classData.courseId,
    //   },
    // });
    const lecturesData = await Lectures.find({
      where: {
        workspaceId: item.workspaceId,
        courseId: classData.courseId,
      },
    });
    console.log('chh_log ---> generate ---> lecturesData:', lecturesData);
    if (lecturesData.length !== numberOfLesson) {
      throw new Exception(ExceptionName.VALIDATE_FAILED, ExceptionCode.VALIDATE_FAILED);
    }
    console.log('chh_log', ClassShiftsClassroomData[0].shift);
    const bulkCreateTimetables: Timetables[] = [];
    for (let index = 0; index < numberOfLesson; index++) {
      /**
       * calculate Next Date shift Cycle
       */
      for (const userWorkspaceShiftScopeItem of userWorkspaceShiftScopesData) {
      }
      const timeTable = new Timetables();
      timeTable.workspaceId = item.workspaceId;
      timeTable.sessionNumberOrder = index + 1;
      timeTable.lessonId = lecturesData[index].lessonId;
      timeTable.lectureId = lecturesData[index].id;
      timeTable.date = null; //wip
      bulkCreateTimetables.push(timeTable);
    }
    console.log('chh_log ---> generate ---> classData:', classData);
    return classData;
  }
}
