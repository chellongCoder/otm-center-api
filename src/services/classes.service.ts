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
import { UpdateStatusClassDto } from '@/dtos/updateStatusClass.dto';
import { CreateClassDto } from '@/dtos/create-class.dto';
import { Workspaces } from '@/models/workspaces.model';
import moment from 'moment-timezone';

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

  public async findAllClasses(userWorkspaceData: UserWorkspaces, page = 1, limit = 10, status: StatusClasses) {
    const [classData, total] = await Classes.findAndCount({
      where: {
        classShiftsClassrooms: {
          userWorkspaceShiftScopes: {
            userWorkspaceId: userWorkspaceData.id,
          },
        },
        status: status,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['course', 'classShiftsClassrooms', 'classShiftsClassrooms.userWorkspaceShiftScopes'],
      order: {
        id: 'ASC',
      },
    });
    return {
      data: classData,
      total,
      pages: Math.ceil(total / limit),
    };
  }
  public async GetClassTimetableByDate(page = 1, limit = 10, order = 'id:asc', search: string, status: StatusClasses) {
    return true;
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
  public async create(item: CreateClassDto, workspaceData: Workspaces) {
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const courseData = await Courses.findOne({
          where: {
            id: item.courseId,
            workspaceId: workspaceData.id,
          },
        });
        if (!courseData?.id) {
          throw new Exception(ExceptionName.COURSE_NOT_FOUND, ExceptionCode.COURSE_NOT_FOUND);
        }
        const newClass = new Classes();
        newClass.name = item.name;
        newClass.courseId = item.courseId;
        newClass.fromTime = moment(item.fromTime, 'YYYY-MM-DD').toDate();
        if (item?.toTime) {
          newClass.toTime = moment(item.toTime, 'YYYY-MM-DD').toDate();
        }
        newClass.attendedNumber = item?.attendedNumber;
        newClass.sessionOfVietnameseTeacher = item?.sessionOfVietnameseTeacher;
        newClass.sessionOfForeignTeacher = item?.sessionOfForeignTeacher;
        newClass.maximumStudent = item?.maximumStudent;
        newClass.maximumStudentSession = item?.maximumStudentSession;
        newClass.code = item.code;
        newClass.note = item?.note;
        newClass.status = item?.status;
        newClass.dailyEvaluationId = item.dailyEvaluationId;

        newClass.sessionNumber = courseData.numberOfLesson;
        newClass.workspaceId = workspaceData.id;
        const classCreate = await await queryRunner.manager.getRepository(Classes).insert(newClass);
        const courseLessons = await Lessons.find({
          where: {
            courseId: courseData.id,
            workspaceId: workspaceData.id,
          },
        });
        const courseLectures = await Lectures.find({
          where: {
            courseId: courseData.id,
            workspaceId: workspaceData.id,
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
          classLessonCreate.workspaceId = workspaceData.id;
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
          classLectureCreate.workspaceId = workspaceData.id;

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
    const timetable = await Timetables.find({
      where: {
        classId: id,
      },
      relations: [
        'class',
        'classLesson',
        'shift',
        'classTimetableDetails',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
      ],
      order: {
        sessionNumberOrder: 'ASC',
      },
    });
    return timetable;
  }
  public async getClassStudentSchedule(classId: number, userWorkspaceId: number, workspaceId: number) {
    await this.checkExistClass(classId, workspaceId);
    return await Timetables.find({
      where: {
        classId: classId,
        classTimetableDetails: {
          userWorkspaceId: userWorkspaceId,
        },
      },
      relations: [
        'class',
        'classLesson',
        'shift',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
        'classShiftsClassroom.classroom',
        'classTimetableDetails',
      ],
      order: {
        sessionNumberOrder: 'ASC',
      },
    });
  }
  public async checkExistClass(classId: number, workspaceId: number, relations?: string[]) {
    if (!classId) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }
    const classData = await Classes.findOne({
      where: {
        id: classId,
        workspaceId,
      },
      relations: relations,
    });
    if (!classData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }
    return classData;
  }
  public async updateDetail(id: number, item: UpdateStatusClassDto) {
    return await Classes.update(id, {
      status: item.status,
    });
  }
}
