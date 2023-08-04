import { Courses } from '@/models/courses.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Lessons } from '@/models/lessons.model';
import { Lectures } from '@/models/lectures.model';

@Service()
export class CoursesService {
  appDataSource: any;
  constructor() {
    this.appDataSource = DbConnection;
  }
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await Courses.findByCond({
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
    return Courses.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: Courses) {
    const course = await Courses.insert(item);
    const numberOfLesson = item.numberOfLesson;
    const bulkCreateLessons: Lessons[] = [];
    const bulkCreateLectures: Lectures[] = [];
    for (let index = 0; index < numberOfLesson; index++) {
      const lesson = new Lessons();
      lesson.courseId = course.identifiers[0]?.id;
      lesson.workspaceId = item.workspaceId;
      bulkCreateLessons.push(lesson);
    }
    const bulkCreateLessonInsert = await Lessons.insert(bulkCreateLessons);
    for (let index = 0; index < numberOfLesson; index++) {
      const lecture = new Lectures();
      lecture.lessonId = bulkCreateLessonInsert.identifiers[index]?.id;
      lecture.courseId = course.identifiers[0]?.id;
      lecture.workspaceId = item.workspaceId;
      bulkCreateLectures.push(lecture);
    }
    await Lectures.insert(bulkCreateLectures);
    return true;
  }

  /**
   * update
   */
  public async update(id: number, item: Courses) {
    return Courses.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return Courses.delete(id);
  }
}
