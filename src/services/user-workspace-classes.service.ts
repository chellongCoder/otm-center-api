import moment from 'moment-timezone';
import { UserWorkspaceClassTypes, UserWorkspaceClasses, ClassScheduleTypes, HomeworkStatus } from '@/models/user-workspace-classes.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { In, IsNull, Like, MoreThanOrEqual, Not } from 'typeorm';
import { Classes } from '@/models/classes.model';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { Timetables } from '@/models/timetables.model';
import { ClassTimetableDetails } from '@/models/class-timetable-details.model';
import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';
import { UpdateStatusUserWorkspaceClassesDto } from '@/dtos/update-status-user-workspace-class.dto';
import { DbConnection } from '@/database/dbConnection';
import { CreateUserWorkspaceClassesDto } from '@/dtos/create-user-workspace-class.dto';

@Service()
export class UserWorkspaceClassesService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await UserWorkspaceClasses.findByCond({
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
    return UserWorkspaceClasses.findOne({
      where: {
        id,
      },
    });
  }
  /**
   * findByFilter
   */
  public async findByFilter(userWorkspaceId: number, status: UserWorkspaceClassTypes) {
    return UserWorkspaceClasses.find({
      where: {
        userWorkspaceId,
        status,
      },
      relations: ['class', 'workspace', 'class.course'],
    });
  }

  /**
   * create
   */
  public async create(item: CreateUserWorkspaceClassesDto, userWorkspaceId: number, workspaceId: number) {
    const userWorkspaceData = await UserWorkspaces.findOne({
      where: {
        id: item.userWorkspaceId,
        workspaceId: workspaceId,
      },
    });
    if (!userWorkspaceData?.id) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_INVALID_TYPE);
    }
    const classData = await Classes.findOne({
      where: {
        id: item.classId,
        workspaceId: workspaceId,
      },
    });
    if (!classData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND, ExceptionCode.CLASS_NOT_FOUND);
    }
    const checkExist = await UserWorkspaceClasses.findOne({
      where: {
        userWorkspaceId: userWorkspaceData.id,
        classId: classData.id,
        workspaceId: workspaceId,
      },
    });
    if (checkExist?.id) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }

    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const newUserWorkspaceClass = new UserWorkspaceClasses();
        newUserWorkspaceClass.classId = classData?.id;
        newUserWorkspaceClass.workspaceId = workspaceId;
        newUserWorkspaceClass.userWorkspaceId = userWorkspaceData?.id;
        newUserWorkspaceClass.fromDate = moment(item.fromDate, 'YYYY-MM-DD').toDate();
        newUserWorkspaceClass.classScheduleType = item.classScheduleType;
        await queryRunner.manager.getRepository(UserWorkspaceClasses).insert(newUserWorkspaceClass);

        /**
         * Add student to timetable
         */
        let timeTableData: Timetables[] = [];
        // WIP check classScheduleType type
        // if (item.classScheduleType === ClassScheduleTypes.ALL) {
        timeTableData = await Timetables.find({
          where: {
            classId: classData.id,
            workspaceId: workspaceId,
            date: MoreThanOrEqual(moment(item.fromDate, 'YYYY-MM-DD').toDate()),
          },
        });
        // }
        const bulkCreateClassTimetableDetails: ClassTimetableDetails[] = [];
        if (timeTableData.length) {
          for (const timetableItem of timeTableData) {
            const classTimetableDetailCreate = new ClassTimetableDetails();
            classTimetableDetailCreate.timetableId = timetableItem.id;
            classTimetableDetailCreate.userWorkspaceId = item.userWorkspaceId;
            classTimetableDetailCreate.workspaceId = workspaceId;

            bulkCreateClassTimetableDetails.push(classTimetableDetailCreate);
          }
          if (bulkCreateClassTimetableDetails.length) {
            await queryRunner.manager.getRepository(ClassTimetableDetails).insert(bulkCreateClassTimetableDetails);
          }
        }
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
  public async update(id: number, item: UserWorkspaceClasses) {
    return UserWorkspaceClasses.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return UserWorkspaceClasses.delete(id);
  }

  public async getHomeworkOfClass({
    userWorkspaceId,
    workspaceId,
    classId,
    status,
  }: {
    userWorkspaceId: number;
    workspaceId: number;
    classId: number;
    status: HomeworkStatus;
  }) {
    let conditionUserWorkspaceClass: any = {
      userWorkspaceId,
    };
    if (classId) {
      conditionUserWorkspaceClass = {
        ...conditionUserWorkspaceClass,
        classId,
      };
    }
    const userWorkspaceClassData = await UserWorkspaceClasses.find({
      where: conditionUserWorkspaceClass,
      relations: ['class'],
    });
    const classIds: number[] = userWorkspaceClassData.map(el => el.classId);
    let conditionTimetable: any = {
      classId: In(classIds),
      classLesson: {
        exercise: Not(IsNull()),
      },
      workspaceId,
    };
    if (status === HomeworkStatus.DONE) {
      conditionTimetable = {
        ...conditionTimetable,
        classTimetableDetails: {
          homeworkAssignment: Not(IsNull()),
        },
      };
    } else {
      const classTimetableDetailData = await ClassTimetableDetails.find({
        where: {
          timetable: {
            classId: In(classIds),
          },
          homeworkAssignment: Not(IsNull()),
          userWorkspaceId,
        },
      });
      const timetableHasAssignmentIds = classTimetableDetailData.map(el => el.timetableId);
      conditionTimetable = {
        ...conditionTimetable,
        id: Not(In(timetableHasAssignmentIds)),
      };
    }
    const timetableExistLesson = await Timetables.find({
      where: conditionTimetable,
      relations: [
        'classLesson',
        'classLesson.classLessonImages',
        'classShiftsClassroom.userWorkspaceShiftScopes',
        'classShiftsClassroom.classroom',
        'classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.classTimetableDetailAssignments',
      ],
      order: {
        sessionNumberOrder: 'ASC',
      },
    });
    let commentData: Comments[] = [];
    if (status === HomeworkStatus.DONE) {
      const targetKeys = timetableExistLesson.map(el => `detail_${el.id}_user_workspace_${userWorkspaceId}`);
      commentData = await Comments.find({
        where: {
          targetKey: In(targetKeys),
          workspaceId: workspaceId,
          category: CategoriesCommentsEnum.HOMEWORK,
        },
        relations: ['subComments'],
      });
    }
    const results: any[] = [];
    for (const userWorkspaceClassItem of userWorkspaceClassData) {
      const timetables: Timetables[] = timetableExistLesson.filter(el => el.classId === userWorkspaceClassItem.classId);
      const timetableResult = [];
      for (const timetableItem of timetables) {
        const targetKey = `detail_${timetableItem.id}_user_workspace_${userWorkspaceId}`;
        const listComment = commentData.filter(el => el.targetKey === targetKey);
        const countComment = listComment.length + listComment.map(el => el.subComments.length).reduce((total, count) => total + count, 0) || 0;
        timetableResult.push({
          ...timetableItem,
          countComment,
        });
      }
      if (timetables.length) {
        results.push({
          ...userWorkspaceClassItem,
          timetables: timetableResult,
          total: timetables.length,
        });
      }
    }
    return {
      data: results,
      total: results.length,
    };
  }
  public async getUserWorkspaceByClassId(classId: number, search?: string) {
    let conditionUserWorkspaceClass: any = {
      classId,
    };
    if (search) {
      conditionUserWorkspaceClass = {
        ...conditionUserWorkspaceClass,
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
      };
    }
    return UserWorkspaceClasses.find({
      where: conditionUserWorkspaceClass,
      relations: ['class', 'userWorkspace', 'userWorkspace.userWorkspaceDevices'],
    });
  }
  public async updateDetailStatus(id: number, item: UpdateStatusUserWorkspaceClassesDto) {
    return await UserWorkspaceClasses.update(id, {
      status: item.status,
    });
  }
}
