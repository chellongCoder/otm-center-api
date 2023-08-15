import { ClassLessons } from '@/models/class-lessons.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Timetables } from '@/models/timetables.model';
import { Like } from 'typeorm';
import { UpdateExerciseClassLessonDto } from '@/dtos/update-exercise-class-lesson.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { ClassTimetableDetails } from '@/models/class-timetable-details.model';
import { UpdateClassLessonDto } from '@/dtos/update-class-lesson.dto';

@Service()
export class ClassLessonsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await ClassLessons.findByCond({
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
  public async findById(id: number, userWorkspaceId?: number) {
    const classLessonData = await ClassLessons.findOne({
      where: {
        id,
      },
    });
    if (!userWorkspaceId) {
      return classLessonData;
    }
    const classTimetableDetail = await ClassTimetableDetails.findOne({
      where: {
        userWorkspaceId: userWorkspaceId,
        timetable: {
          classLesson: {
            id,
          },
        },
      },
    });
    return {
      ...classTimetableDetail,
      ...classLessonData,
    };
  }

  public async getHomeworkByClassId(classId: number, workspaceId: number, search: string) {
    const whereCondition = [];
    if (search) {
      whereCondition.push(
        {
          workspaceId,
          classId,
          classLecture: {
            name: Like(`%${search}%`),
          },
        },
        {
          workspaceId,
          classId,
          classLesson: {
            name: Like(`%${search}%`),
          },
        },
      );
    } else {
      whereCondition.push({
        workspaceId,
        classId,
      });
    }
    if (Number(search)) {
      whereCondition.push({
        workspaceId,
        classId,
        sessionNumberOrder: Number(search),
      });
    }
    return Timetables.find({
      where: whereCondition,
      relations: ['classLecture', 'classLesson'],
      order: {
        date: 'ASC',
        fromTime: 'ASC',
      },
    });
  }

  /**
   * create
   */
  public async create(item: ClassLessons) {
    const results = await ClassLessons.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: ClassLessons) {
    return ClassLessons.update(id, item);
  }

  /**
   * update
   */
  public async updateExercise(id: number, item: UpdateExerciseClassLessonDto) {
    const classLessonData = await ClassLessons.findOne({ where: { id } });
    if (!classLessonData) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const updateClassLesson: Partial<ClassLessons> = {
      ...classLessonData,
      exercise: item.exercise,
    };
    return await ClassLessons.update(id, updateClassLesson);
  }

  /**
   * update
   */
  public async updateClassLessonByTimetable(timetableId: number, item: UpdateClassLessonDto) {
    const timetableData = await Timetables.findOne({
      where: {
        id: timetableId,
      },
      relations: ['classLesson'],
    });
    const classLessonData = await ClassLessons.findOne({ where: { id: timetableData?.classLessonId } });
    if (!classLessonData) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const updateClassLesson: Partial<ClassLessons> = {
      ...classLessonData,
      name: item.name,
      content: item.content,
      exercise: item.exercise,
    };
    return await ClassLessons.update(classLessonData.id, updateClassLesson);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return ClassLessons.delete(id);
  }
}
