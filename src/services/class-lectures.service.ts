import { ClassLectures } from '@/models/class-lectures.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { UpdateClassLectureDto } from '@/dtos/update-class-lecture.dto';
import { Timetables } from '@/models/timetables.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';

@Service()
export class ClassLecturesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await ClassLectures.findByCond({
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
    return ClassLectures.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: ClassLectures) {
    const results = await ClassLectures.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: ClassLectures) {
    return ClassLectures.update(id, item);
  }

  /**
   * update
   */
  public async updateClassLectureByTimetable(timetableId: number, item: UpdateClassLectureDto) {
    const timetableData = await Timetables.findOne({
      where: {
        id: timetableId,
      },
      relations: ['classLecture'],
    });
    const classLectureData = await ClassLectures.findOne({ where: { id: timetableData?.classLectureId } });
    if (!classLectureData) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const updateClassLecture: Partial<ClassLectures> = {
      ...classLectureData,
      name: item.name,
      content: item.content,
      exercise: item.exercise,
    };
    return await ClassLectures.update(classLectureData.id, updateClassLecture);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return ClassLectures.delete(id);
  }
}
