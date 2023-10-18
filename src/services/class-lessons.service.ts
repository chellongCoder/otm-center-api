import { ClassLessons } from '@/models/class-lessons.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { Timetables } from '@/models/timetables.model';
import { In, LessThanOrEqual, Like } from 'typeorm';
import { UpdateExerciseClassLessonDto } from '@/dtos/update-exercise-class-lesson.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { ClassTimetableDetails } from '@/models/class-timetable-details.model';
import { UpdateClassLessonDto } from '@/dtos/update-class-lesson.dto';
import { UserWorkspaceClasses } from '@/models/user-workspace-classes.model';
import { CategoriesNotificationEnum, SendMessageNotificationRabbit, sendNotificationToRabbitMQ } from '@/utils/rabbit-mq.util';
import { UserWorkspaceDevices } from '@/models/user-workspace-devices.model';
import { AppType, UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import moment from 'moment-timezone';
import { TimeFormat } from '@/constants';
import _ from 'lodash';
import { DbConnection } from '@/database/dbConnection';
import { ClassLessonImages } from '@/models/class-lesson-images.model';
import { CategoriesCommentsEnum, Comments } from '@/models/comments.model';

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
      relations: ['classLessonImages'],
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
      relations: ['classTimetableDetailAssignments'],
    });
    return {
      ...classTimetableDetail,
      ...classLessonData,
      classTimetableDetailId: classTimetableDetail?.id,
    };
  }

  public async getHomeworkByClassId(classId: number, workspaceId: number, search: string, page = 1, limit = 10) {
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
          classLecture: {
            content: Like(`%${search}%`),
          },
        },
        {
          workspaceId,
          classId,
          classLecture: {
            exercise: Like(`%${search}%`),
          },
        },
        {
          workspaceId,
          classId,
          classLesson: {
            name: Like(`%${search}%`),
          },
        },
        {
          workspaceId,
          classId,
          classLesson: {
            content: Like(`%${search}%`),
          },
        },
        {
          workspaceId,
          classId,
          classLesson: {
            exercise: Like(`%${search}%`),
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
    const [timetableData, total] = await Timetables.findAndCount({
      where: whereCondition,
      relations: [
        'classLecture',
        'classLesson',
        'classLesson.classLessonImages',
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.classTimetableDetailAssignments',
      ],
      order: {
        date: 'ASC',
        fromTime: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: timetableData,
      total,
      pages: Math.ceil(total / limit),
    };
  }
  public async getHomeworkByTimetableId(timetableId: number, workspaceId: number) {
    const timetableResult = await Timetables.findOne({
      where: {
        id: timetableId,
        workspaceId,
      },
      relations: [
        'classLecture',
        'classLesson',
        'classLesson.classLessonImages',
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.classTimetableDetailAssignments',
      ],
      order: {
        date: 'ASC',
        fromTime: 'ASC',
      },
    });
    if (timetableResult && timetableResult.classTimetableDetails && timetableResult.classTimetableDetails.length) {
      const targetKeys = timetableResult.classTimetableDetails.map(el => `detail_${el.timetableId}_user_workspace_${el.userWorkspaceId}`);
      const commentData: Comments[] = await Comments.find({
        where: {
          targetKey: In(targetKeys),
          workspaceId: workspaceId,
          category: CategoriesCommentsEnum.HOMEWORK,
        },
        relations: ['subComments'],
      });

      const classTimetableDetailFormat = [];
      for (const classTimetableDetailItem of timetableResult.classTimetableDetails) {
        const targetKey = `detail_${classTimetableDetailItem.id}_user_workspace_${classTimetableDetailItem.userWorkspaceId}`;
        const listComment = commentData.filter(el => el.targetKey === targetKey);
        const countComment = listComment.length + listComment.map(el => el.subComments.length).reduce((total, count) => total + count, 0);
        classTimetableDetailFormat.push({
          ...classTimetableDetailItem,
          countComment,
        });
      }
      return {
        ...timetableResult,
        classTimetableDetails: classTimetableDetailFormat,
      };
    } else return timetableResult;
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
  public async updateExercise(id: number, item: UpdateExerciseClassLessonDto, userWorkspaceId: number, workspaceId: number) {
    const timetableData = await Timetables.findOne({
      where: {
        classLesson: {
          id,
        },
      },
      relations: ['classLesson', 'class', 'classLesson.classLessonImages'],
    });
    if (!timetableData || !timetableData.classLesson) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const updateClassLesson: Partial<ClassLessons> = {
      exercise: item.exercise,
    };
    const userWorkspaceClassData = await UserWorkspaceClasses.find({
      where: {
        classId: timetableData.class.id,
        fromDate: LessThanOrEqual(moment(timetableData.date).toDate()),
      },
      relations: ['class', 'userWorkspace'],
    });

    const receiveUserWorkspaceIds: number[] = userWorkspaceClassData?.length ? userWorkspaceClassData.map(el => el.userWorkspaceId) : [];
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.getRepository(ClassLessons).update(id, updateClassLesson);
        const classLessonImageCurrentData = timetableData.classLesson.classLessonImages;

        if (item.exerciseLinkImages.length || classLessonImageCurrentData.length) {
          const bulkCreateClassLessonImages: ClassLessonImages[] = [];
          const deleteClassLessonImageIds: number[] = classLessonImageCurrentData.map(el => el.id);
          for (const exerciseLinkImageItem of item.exerciseLinkImages) {
            const newClassLessonImage = new ClassLessonImages();
            newClassLessonImage.classLessonId = id;
            newClassLessonImage.url = exerciseLinkImageItem.link;
            newClassLessonImage.type = exerciseLinkImageItem.type;
            newClassLessonImage.userWorkspaceId = userWorkspaceId;
            newClassLessonImage.workspaceId = workspaceId;
            bulkCreateClassLessonImages.push(newClassLessonImage);
          }
          if (bulkCreateClassLessonImages.length) {
            await queryRunner.manager.getRepository(ClassLessonImages).insert(bulkCreateClassLessonImages);
          }
          if (deleteClassLessonImageIds.length) {
            await queryRunner.manager.getRepository(ClassLessonImages).softDelete(deleteClassLessonImageIds);
          }
        }
        /**
         * push notification
         */
        if (userWorkspaceClassData && userWorkspaceClassData.length) {
          const userWorkspaceDeviceData = await UserWorkspaceDevices.find({
            where: {
              userWorkspaceId: In(receiveUserWorkspaceIds),
            },
          });
          if (userWorkspaceDeviceData.length) {
            const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];
            for (const receiveUserWorkspaceId of _.uniq(receiveUserWorkspaceIds)) {
              const userWorkspaceData = userWorkspaceClassData.find(el => el.userWorkspaceId === receiveUserWorkspaceId);
              const playerIdsPush = userWorkspaceDeviceData.filter(el => el.userWorkspaceId === receiveUserWorkspaceId)?.map(el => el.playerId) || [];
              if (userWorkspaceData && userWorkspaceData.userWorkspace) {
                const messageNotification = `Học viên ${userWorkspaceData.userWorkspace.fullname} lớp ${timetableData.class.name} có BTVN buổi thứ ${
                  timetableData.sessionNumberOrder
                } ngày ${moment(timetableData.date).format(TimeFormat.date)}`;

                const msg: SendMessageNotificationRabbit = {
                  type: AppType.STUDENT,
                  data: {
                    category: CategoriesNotificationEnum.HOMEWORK,
                    content: messageNotification,
                    id: timetableData.id,
                    playerIds: _.uniq(playerIdsPush),
                  },
                };
                await sendNotificationToRabbitMQ(msg);
                const newUserWorkspaceNotification = new UserWorkspaceNotifications();
                newUserWorkspaceNotification.content = messageNotification;
                newUserWorkspaceNotification.appType = AppType.STUDENT;
                newUserWorkspaceNotification.msg = JSON.stringify(msg);
                newUserWorkspaceNotification.detailId = `${timetableData.id}`;
                newUserWorkspaceNotification.date = moment().toDate();
                newUserWorkspaceNotification.receiverUserWorkspaceId = receiveUserWorkspaceId;
                newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
                newUserWorkspaceNotification.workspaceId = timetableData.workspaceId;
                bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
              }
            }
            await queryRunner.manager.getRepository(UserWorkspaceNotifications).insert(bulkCreateUserWorkspaceNotifications);
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
  public async updateClassLessonByTimetable(timetableId: number, item: UpdateClassLessonDto) {
    const timetableData = await Timetables.findOne({
      where: {
        id: timetableId,
      },
      relations: ['classLesson', 'classLesson.classLessonImages'],
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
