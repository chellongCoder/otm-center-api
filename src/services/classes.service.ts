import { Classes } from '@/models/classes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Timetables } from '@/models/timetables.model';
import { Courses } from '@/models/courses.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { ClassLectures } from '@/models/class-lectures.model';
import { ClassLessons } from '@/models/class-lessons.model';
import { Lectures } from '@/models/lectures.model';
import { Lessons } from '@/models/lessons.model';

@Service()
export class ClassesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Classes.findByCond({
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
    return Classes.findOne({
      where: {
        id,
      },
      relations: ['course', 'workspace'],
    });
  }

  /**
   * create
   */
  public async create(item: Classes) {
    const classCreate = await Classes.insert(item);
    const courseData = await Courses.findOne({
      where: {
        id: item.courseId,
        workspaceId: item.workspaceId,
      },
    });
    if (!courseData?.id) {
      throw new Exception(ExceptionName.COURSE_NOT_FOUND, ExceptionCode.COURSE_NOT_FOUND);
    }
    const courseLessons = await Lessons.find({
      where: {
        courseId: courseData.id,
        workspaceId: item.workspaceId,
      },
    });
    const courseLectures = await Lectures.find({
      where: {
        courseId: courseData.id,
        workspaceId: item.workspaceId,
      },
    });

    const bulkCreateClassLessons: ClassLessons[] = [];
    const bulkCreateClassLectures: ClassLectures[] = [];
    for (const courseLessonItem of courseLessons) {
      const classLessonCreate = new ClassLessons();
      classLessonCreate.name = courseLessonItem.name;
      classLessonCreate.content = courseLessonItem.content;
      classLessonCreate.exercise = courseLessonItem.exercise;
      classLessonCreate.sessionNumberOrder = courseLessonItem.sessionNumberOrder;
      classLessonCreate.classId = classCreate.identifiers[0].id;
      classLessonCreate.workspaceId = item.workspaceId;
      bulkCreateClassLessons.push(classLessonCreate);
    }
    for (const courseLectureItem of courseLectures) {
      const classLectureCreate = new ClassLectures();
      classLectureCreate.sessionNumberOrder = courseLectureItem.sessionNumberOrder;
      classLectureCreate.name = courseLectureItem.name;
      classLectureCreate.content = courseLectureItem.content;
      classLectureCreate.exercise = courseLectureItem.exercise;
      classLectureCreate.equipment = courseLectureItem.equipment;
      classLectureCreate.isUseName = courseLectureItem.isUseName;
      classLectureCreate.classId = classCreate.identifiers[0].id;
      classLectureCreate.workspaceId = item.workspaceId;

      bulkCreateClassLectures.push(classLectureCreate);
    }

    if (bulkCreateClassLessons.length) {
      await ClassLessons.insert(bulkCreateClassLessons);
    }
    if (bulkCreateClassLectures.length) {
      await ClassLectures.insert(bulkCreateClassLectures);
    }
    return classCreate;
  }

  /**
   * update
   */
  public async update(id: number, item: Classes) {
    return Classes.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Classes.delete(id);
  }
  public async getClassSchedule(id: number) {
    return await Timetables.find({
      where: {
        classId: id,
      },
      relations: [
        'class',
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
