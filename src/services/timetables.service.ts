import { Timetables } from '@/models/timetables.model';
import _ from 'lodash';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { GenerateTimetableDto } from '@/dtos/generate-timetable.dto';
import { Classes } from '@/models/classes.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { ClassShiftsClassrooms } from '@/models/class-shifts-classrooms.model';
import { Shifts } from '@/models/shifts.model';
import moment from 'moment-timezone';
import { calculateNextStepCycle } from '@/utils/util';
import { Between } from 'typeorm';
import { ClassLectures } from '@/models/class-lectures.model';
import { ClassLessons } from '@/models/class-lessons.model';

interface ShiftApplyTimetables extends Partial<Shifts> {
  id: number;
  classShiftsClassroomId: number;
  fromTime: Date;
  toTime: Date;
  workspaceId: number;
  weekday: number;
}
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
  public async findByIdTeacher(id: number) {
    return Timetables.findOne({
      where: {
        id,
      },
      relations: [
        'class',
        'classLesson',
        'classLecture',
        'shift',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
      ],
    });
  }

  /**
   * findById
   */
  public async findByIdStudent(id: number, userWorkspaceId: number) {
    return Timetables.findOne({
      where: {
        id,
        classTimetableDetails: {
          userWorkspaceId: userWorkspaceId,
        },
      },
      relations: [
        'class',
        'classLesson',
        'classLecture',
        'shift',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.classTimetableDetailEvaluations',
        'classTimetableDetails.classTimetableDetailEvaluations.evaluationCriteria',
        'classTimetableDetails.classTimetableDetailEvaluations.classTimetableDetailEvaluationOptions',
        'classTimetableDetails.classTimetableDetailEvaluations.classTimetableDetailEvaluationOptions.evaluationOptionValue',
      ],
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
    if (!classData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }
    const numberOfLesson: number = classData.sessionNumber;
    const ClassShiftsClassroomData: ClassShiftsClassrooms[] = await ClassShiftsClassrooms.find({
      where: {
        classId: classData.id,
        workspaceId: item.workspaceId,
      },
      relations: ['shift'],
    });
    const shiftData: ShiftApplyTimetables[] = _.sortBy(
      ClassShiftsClassroomData.map((el: ClassShiftsClassrooms) => {
        return {
          ...el.shift,
          classShiftsClassroomId: el.id,
        };
      }),
      ['weekday', 'fromTime'],
    );
    const classLecturesData = await ClassLectures.find({
      where: {
        workspaceId: item.workspaceId,
        classId: classData.id,
      },
    });
    const classLessonsData = await ClassLessons.find({
      where: {
        workspaceId: item.workspaceId,
        classId: classData.id,
      },
    });
    if (classLecturesData.length !== numberOfLesson || classLessonsData.length !== numberOfLesson) {
      throw new Exception(ExceptionName.VALIDATE_FAILED, ExceptionCode.VALIDATE_FAILED);
    }
    const startDateClass = moment(classData.fromTime).format('YYYY-MM-DD');
    const dayOfWeekStart = moment(classData.fromTime).weekday();
    let dateCurrentCheck = startDateClass;
    const lastIndexShift = shiftData.length - 1;
    let indexOfFirstShiftApply = 0;
    let indexCurrentCheck = 0;

    const bulkCreateTimetables: Timetables[] = [];
    /**
     * calculate first day shift
     */
    if (dayOfWeekStart === 0) {
      const shiftApplyFirst = shiftData.filter(el => el.weekday === 0);
      if (shiftApplyFirst.length >= 1) {
        indexOfFirstShiftApply = shiftData.findIndex(el => el.id === shiftApplyFirst[0].id);
      }
      // wip check điều kiện case thiếu
      indexCurrentCheck = indexOfFirstShiftApply;
    } else {
      const shiftApplyFirst = shiftData.filter(el => el.weekday >= dayOfWeekStart);
      if (shiftApplyFirst.length) {
        indexOfFirstShiftApply = shiftData.findIndex(el => el.id === shiftApplyFirst[0].id);
      } else {
        indexOfFirstShiftApply = 0;
      }
      indexCurrentCheck = indexOfFirstShiftApply;
    }
    for (let index = 0; index < numberOfLesson; index++) {
      const shiftDataApply = shiftData[indexCurrentCheck];
      dateCurrentCheck = calculateNextStepCycle(shiftDataApply.weekday, dateCurrentCheck);

      const timeTable = new Timetables();
      timeTable.workspaceId = item.workspaceId;
      timeTable.shiftId = shiftDataApply.id;
      timeTable.classId = classData.id;
      timeTable.sessionNumberOrder = index + 1;
      timeTable.classLessonId = classLessonsData.find(el => el.sessionNumberOrder === index + 1)?.id || 0;
      timeTable.classLectureId = classLecturesData.find(el => el.sessionNumberOrder === index + 1)?.id || 0;
      timeTable.classShiftsClassroomId = shiftDataApply?.classShiftsClassroomId;
      timeTable.validDate = moment().toDate();
      timeTable.fromTime = shiftDataApply.fromTime;
      timeTable.toTime = shiftDataApply.toTime;
      timeTable.date = moment(dateCurrentCheck, 'YYYY-MM-DD').toDate();
      bulkCreateTimetables.push(timeTable);
      if (indexCurrentCheck === lastIndexShift) {
        indexCurrentCheck = 0;
      } else {
        indexCurrentCheck++;
      }

      const shiftDataApplyNext = shiftData[indexCurrentCheck];
      if (shiftDataApplyNext.weekday !== shiftDataApply.weekday || shiftData.length === 1) {
        dateCurrentCheck = moment(dateCurrentCheck, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
      }
    }
    return await Timetables.insert(bulkCreateTimetables);
  }
  public async findAllByDate(fromDate: number, toDate: number, userWorkspaceId: number, workspaceId: number) {
    return await Timetables.find({
      where: {
        workspaceId,
        date: Between(moment(fromDate, 'YYYYMMDD').toDate(), moment(toDate, 'YYYYMMDD').toDate()),
        classTimetableDetails: {
          userWorkspaceId: userWorkspaceId,
        },
      },
      relations: [
        'class',
        'classLesson',
        'shift',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
      ],
      order: {
        sessionNumberOrder: 'ASC',
      },
    });
  }
}
