import { Classes, StatusClasses } from '@/models/classes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Timetables } from '@/models/timetables.model';
import { Courses } from '@/models/courses.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { ClassLectures } from '@/models/class-lectures.model';
import { ClassLessons } from '@/models/class-lessons.model';
import { Lectures } from '@/models/lectures.model';
import { Lessons } from '@/models/lessons.model';
import { ClassShiftsClassrooms } from '@/models/class-shifts-classrooms.model';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { UserWorkspaceShiftScopes } from '@/models/user-workspace-shift-scopes.model';
import _ from 'lodash';
import { DbConnection } from '@/database/dbConnection';
import { DailyEvaluations } from '@/models/daily-evaluations.model';

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

  public async findAllClasses(page = 1, limit = 10, order = 'id:asc', search: string, status: StatusClasses) {
    const orderCond = QueryParser.toOrderCond(order);

    const filteredData = await Classes.findByCond({
      sort: orderCond.sort,
      order: orderCond.order,
      skip: (page - 1) * limit,
      take: limit,
      cache: false,
      search: QueryParser.toFilters(search),
      relations: {
        course: true,
      },
      where: {
        status: status,
      },
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
    const classData = await Classes.findOne({
      where: {
        id,
      },
      relations: [
        'course',
        'workspace',
        'classShiftsClassrooms.userWorkspaceShiftScopes',
        'classShiftsClassrooms.userWorkspaceShiftScopes.userWorkspace',
      ],
    });
    const teacherData: UserWorkspaces[] = [];
    const classShiftsClassroomsData = classData?.classShiftsClassrooms as ClassShiftsClassrooms[];
    if (classShiftsClassroomsData.length) {
      const userWorkspaceShiftScopesData: UserWorkspaceShiftScopes[] = [];
      for (const classShiftsClassroomsItem of classShiftsClassroomsData) {
        userWorkspaceShiftScopesData.push(...classShiftsClassroomsItem.userWorkspaceShiftScopes);
      }
      if (userWorkspaceShiftScopesData.length) {
        for (const userWorkspaceShiftScopesItem of userWorkspaceShiftScopesData) {
          teacherData.push(userWorkspaceShiftScopesItem.userWorkspace);
        }
      }
    }
    return {
      data: {
        ...classData,
        teacher: _.uniqBy(teacherData, 'id'),
      },
    };
  }

  /**
   * create
   */
  public async create(item: Classes) {
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const classCreate = await await queryRunner.manager.getRepository(Classes).insert(item);
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
          await queryRunner.manager.getRepository(ClassLessons).insert(bulkCreateClassLessons);
        }
        if (bulkCreateClassLectures.length) {
          await queryRunner.manager.getRepository(ClassLectures).insert(bulkCreateClassLectures);
        }
        /**
         * update daily evaluation config
         */
        await queryRunner.manager.getRepository(DailyEvaluations).update(item.dailyEvaluationId, {
          editable: false,
        });
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Exception(ExceptionName.SERVER_ERROR, ExceptionCode.SERVER_ERROR);
      } finally {
        await queryRunner.release();
      }
    }
    return true;
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
