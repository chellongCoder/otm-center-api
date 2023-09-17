import { ClassTimetableDetails, LearningStatus } from '@/models/class-timetable-details.model';
import { Service } from 'typedi';
import { QueryParser } from '@/utils/query-parser';
import { UpdateFinishAssignmentDto } from '@/dtos/updateFinishAssignment.dto';
import { Timetables } from '@/models/timetables.model';
import { Like } from 'typeorm';
import { UpdateStudentAttendanceDto } from '@/dtos/updateStudentAttentdance.dto';
import { Exception, ExceptionCode, ExceptionName } from '@/exceptions';
import { DbConnection } from '@/database/dbConnection';
import moment from 'moment-timezone';
import { UpdateClassTimetableDetailMarkingDto } from '@/dtos/updateClassTimetableDetailMarking.dto';
import { UpdateEvaluationInLessonDto } from '@/dtos/update-evaluation-student-in-lesson.dto';
import { DailyEvaluations } from '@/models/daily-evaluations.model';
import { EvaluationTypes } from '@/models/evaluation-criterias.model';
import { ClassTimetableDetailEvaluations } from '@/models/class-timetable-detail-evaluations.model';
import { ClassTimetableDetailEvaluationOptions } from '@/models/class-timetable-detail-evaluation-options.model';
import { AssignmentTypes, ClassTimetableDetailAssignments } from '@/models/class-timetable-detail-assignments.model';
import { Workspaces } from '@/models/workspaces.model';
import { UserWorkspaces } from '@/models/user-workspaces.model';
import { TimeFormat } from '@/constants';
import { CategoriesNotificationEnum, SendMessageNotificationRabbit, sendNotificationToRabbitMQ } from '@/utils/rabbit-mq.util';
import { AppType, UserWorkspaceNotifications } from '@/models/user-workspace-notifications.model';
import _ from 'lodash';
import { UpdateContentAssignmentDto } from '@/dtos/updateContentAssignment.dto';

@Service()
export class ClassTimetableDetailsService {
  public async findAll(page = 1, limit = 10, order = 'id:asc', search: string) {
    const orderCond = QueryParser.toOrderCond(order);
    const filteredData = await ClassTimetableDetails.findByCond({
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
    return ClassTimetableDetails.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * create
   */
  public async create(item: ClassTimetableDetails) {
    const results = await ClassTimetableDetails.insert(item);
    return results;
  }

  /**
   * update
   */
  public async update(id: number, item: ClassTimetableDetails) {
    return ClassTimetableDetails.update(id, item);
  }

  /**
   * delete
   */
  public async delete(id: number) {
    return ClassTimetableDetails.delete(id);
  }
  public async finishAssignment(item: UpdateFinishAssignmentDto, userWorkspaceData: UserWorkspaces, workspaceData: Workspaces) {
    const userWorkspaceId = userWorkspaceData.id;
    const workspaceId = workspaceData.id;
    const classTimetableDetailData = await ClassTimetableDetails.findOne({
      where: {
        userWorkspaceId: userWorkspaceId,
        workspaceId: workspaceId,
        timetableId: item.timetableId,
      },
      relations: [
        'timetable',
        'timetable.classShiftsClassroom',
        'timetable.classShiftsClassroom.userWorkspaceShiftScopes',
        'timetable.classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace',
        'timetable.classShiftsClassroom.userWorkspaceShiftScopes.userWorkspace.userWorkspaceDevices',
        'timetable.class',
      ],
    });
    if (!classTimetableDetailData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND_STUDENT, ExceptionCode.CLASS_NOT_FOUND_STUDENT);
    }
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.getRepository(ClassTimetableDetails).update(classTimetableDetailData.id, {
          homeworkAssignment: item.assignment,
          homeworkAssignmentTime: moment().toDate(),
        });
        const bulkCreateAssignmentDetail: Partial<ClassTimetableDetailAssignments>[] = [];
        for (const linkImageItem of item.assignmentLinkImages) {
          if (linkImageItem.link) {
            const itemCreate = new ClassTimetableDetailAssignments();
            itemCreate.classTimetableDetailId = classTimetableDetailData.id;
            itemCreate.type = AssignmentTypes.IMAGE;
            itemCreate.link = linkImageItem.link;
            itemCreate.note = linkImageItem.note;
            itemCreate.workspaceId = workspaceId;
            bulkCreateAssignmentDetail.push(itemCreate);
          }
        }
        for (const linkNoteItem of item.assignmentLinkNotes) {
          if (linkNoteItem.link) {
            const itemCreate = new ClassTimetableDetailAssignments();
            itemCreate.classTimetableDetailId = classTimetableDetailData.id;
            itemCreate.type = AssignmentTypes.LINK;
            itemCreate.link = linkNoteItem.link;
            itemCreate.note = linkNoteItem.note;
            itemCreate.workspaceId = workspaceId;
            bulkCreateAssignmentDetail.push(itemCreate);
          }
        }
        await queryRunner.manager.getRepository(ClassTimetableDetailAssignments).insert(bulkCreateAssignmentDetail);

        /**
         * push notification
         */

        const playerIds: string[] = [];
        const receiveUserWorkspaceIds: number[] = [];
        const userWorkspaceShiftScopesData = classTimetableDetailData.timetable.classShiftsClassroom.userWorkspaceShiftScopes;
        for (const userWorkspaceShiftScopeItem of userWorkspaceShiftScopesData) {
          const userWorkspaceDevicesData = userWorkspaceShiftScopeItem.userWorkspace.userWorkspaceDevices;
          for (const userWorkspaceDeviceItem of userWorkspaceDevicesData) {
            playerIds.push(userWorkspaceDeviceItem.playerId);
            receiveUserWorkspaceIds.push(userWorkspaceDeviceItem.userWorkspaceId);
          }
        }
        if (playerIds.length) {
          const contentNotify = `${workspaceData.name} Học viên ${userWorkspaceData.fullname} trả lời bài tập về nhà buổi thứ ${
            classTimetableDetailData.timetable.sessionNumberOrder
          } ngày ${moment(classTimetableDetailData.timetable.date).format(TimeFormat.date)} lớp ${classTimetableDetailData.timetable.class.name}`;
          const msg: SendMessageNotificationRabbit = {
            type: AppType.TEACHER,
            data: {
              category: CategoriesNotificationEnum.HOMEWORK,
              content: contentNotify,
              id: classTimetableDetailData.timetable.id,
              playerIds: _.uniq(playerIds),
            },
          };
          await sendNotificationToRabbitMQ(msg);

          const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];
          for (const receiveUserWorkspaceId of _.uniq(receiveUserWorkspaceIds)) {
            const newUserWorkspaceNotification = new UserWorkspaceNotifications();
            newUserWorkspaceNotification.content = contentNotify;
            newUserWorkspaceNotification.appType = AppType.TEACHER;
            newUserWorkspaceNotification.msg = JSON.stringify(msg);
            newUserWorkspaceNotification.detailId = `${classTimetableDetailData.timetable.id}`;
            newUserWorkspaceNotification.date = moment().toDate();
            newUserWorkspaceNotification.receiverUserWorkspaceId = receiveUserWorkspaceId;
            newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
            newUserWorkspaceNotification.workspaceId = workspaceId;
            bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
          }
          await queryRunner.manager.getRepository(UserWorkspaceNotifications).insert(bulkCreateUserWorkspaceNotifications);
        }
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
      return true;
    }
  }
  public async updateAssignment(timetableId: number, item: UpdateContentAssignmentDto, userWorkspaceData: UserWorkspaces) {
    const userWorkspaceId = userWorkspaceData.id;
    const workspaceId = userWorkspaceData.workspaceId;
    const classTimetableDetailData = await ClassTimetableDetails.findOne({
      where: {
        userWorkspaceId: userWorkspaceId,
        workspaceId: workspaceId,
        timetableId,
      },
      relations: ['classTimetableDetailAssignments', 'timetable', 'timetable.class'],
    });
    if (!classTimetableDetailData?.id) {
      throw new Exception(ExceptionName.CLASS_NOT_FOUND_STUDENT, ExceptionCode.CLASS_NOT_FOUND_STUDENT);
    }
    /**
     * Update assignment
     */
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.getRepository(ClassTimetableDetails).update(classTimetableDetailData.id, {
          homeworkAssignment: item.assignment,
          homeworkAssignmentTime: moment().toDate(),
        });
        const classTimetableDetailAssignmentData = classTimetableDetailData.classTimetableDetailAssignments;
        const assignmentLinkImageCurrent = classTimetableDetailAssignmentData.filter(el => el.type === AssignmentTypes.IMAGE);
        const assignmentLinkLinkCurrent = classTimetableDetailAssignmentData.filter(el => el.type === AssignmentTypes.LINK);

        const bulkCreateAssignmentDetail: Partial<ClassTimetableDetailAssignments>[] = [];
        const bulkUpdateAssignmentDetail: Partial<ClassTimetableDetailAssignments>[] = [];
        const assignmentDetailExist: number[] = [];
        for (const linkImageItem of item.assignmentLinkImages) {
          if (!linkImageItem.link) {
            continue;
          }
          const existLinkImageItem = assignmentLinkImageCurrent.find(el => el.link === linkImageItem.link);
          if (existLinkImageItem && existLinkImageItem.note === linkImageItem.note) {
            assignmentDetailExist.push(existLinkImageItem.id);
            continue;
          } else if (existLinkImageItem) {
            bulkUpdateAssignmentDetail.push({
              ...existLinkImageItem,
              note: linkImageItem.note,
            });
            assignmentDetailExist.push(existLinkImageItem.id);
          } else {
            const itemCreate = new ClassTimetableDetailAssignments();
            itemCreate.classTimetableDetailId = classTimetableDetailData.id;
            itemCreate.type = AssignmentTypes.IMAGE;
            itemCreate.link = linkImageItem.link;
            itemCreate.note = linkImageItem.note;
            itemCreate.workspaceId = workspaceId;
            bulkCreateAssignmentDetail.push(itemCreate);
          }
        }
        for (const linkNoteItem of item.assignmentLinkNotes) {
          if (!linkNoteItem.link) {
            continue;
          }
          const existLinkNoteItem = assignmentLinkLinkCurrent.find(el => el.link === linkNoteItem.link);
          if (existLinkNoteItem && existLinkNoteItem.note === linkNoteItem.note) {
            assignmentDetailExist.push(existLinkNoteItem.id);
            continue;
          } else if (existLinkNoteItem) {
            bulkUpdateAssignmentDetail.push({
              ...existLinkNoteItem,
              note: linkNoteItem.note,
            });
            assignmentDetailExist.push(existLinkNoteItem.id);
          } else {
            const itemCreate = new ClassTimetableDetailAssignments();
            itemCreate.classTimetableDetailId = classTimetableDetailData.id;
            itemCreate.type = AssignmentTypes.LINK;
            itemCreate.link = linkNoteItem.link;
            itemCreate.note = linkNoteItem.note;
            itemCreate.workspaceId = workspaceId;
            bulkCreateAssignmentDetail.push(itemCreate);
          }
        }
        const bulkDeleteAssignmentDetail = classTimetableDetailAssignmentData.map(el => el.id).filter(el => !assignmentDetailExist.includes(el));
        await queryRunner.manager.getRepository(ClassTimetableDetailAssignments).save([...bulkCreateAssignmentDetail, ...bulkUpdateAssignmentDetail]);
        if (bulkDeleteAssignmentDetail.length) {
          await queryRunner.manager.getRepository(ClassTimetableDetailAssignments).softDelete(bulkDeleteAssignmentDetail);
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

  public async getAttendances(timetableId: number, search?: string) {
    let condition: any = {
      id: timetableId,
    };
    if (search) {
      condition = {
        ...condition,
        classTimetableDetails: {
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
        },
      };
    }
    return Timetables.findOne({
      where: condition,
      relations: [
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.classTimetableDetailEvaluations',
        'classTimetableDetails.classTimetableDetailEvaluations.evaluationCriteria',
        'classTimetableDetails.classTimetableDetailEvaluations.classTimetableDetailEvaluationOptions',
        'classTimetableDetails.classTimetableDetailEvaluations.classTimetableDetailEvaluationOptions.evaluationOptionValue',
      ],
    });
  }
  public async updateClassTimetableDetailMarking(id: number, item: UpdateClassTimetableDetailMarkingDto, userWorkspaceId: number) {
    const classTimetableDetailData = await ClassTimetableDetails.findOne({
      where: {
        id,
      },
      relations: ['userWorkspace', 'userWorkspace.userWorkspaceDevices', 'timetable'],
    });
    if (!classTimetableDetailData?.id) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }
    await ClassTimetableDetails.update(id, {
      homeworkAssessment: item.homeworkAssessment,
      homeworkScore: item.homeworkScore,
      homeworkByUserWorkspaceId: userWorkspaceId,
    });
    /**
     * push notification to student
     */
    const userWorkspaceDeviceData = classTimetableDetailData.userWorkspace.userWorkspaceDevices;
    const playerIdsPush = userWorkspaceDeviceData.map(el => el.playerId);
    if (userWorkspaceDeviceData && userWorkspaceDeviceData.length) {
      const messageNotification = `BTVN buổi thứ ${classTimetableDetailData.timetable.sessionNumberOrder} ca học ${moment(
        classTimetableDetailData.timetable.fromTime,
        TimeFormat.time,
      ).format(TimeFormat.hours)} - ${moment(classTimetableDetailData.timetable.toTime, TimeFormat.time).format(TimeFormat.hours)} ngày ${moment(
        classTimetableDetailData.timetable.date,
      ).format(TimeFormat.date)} của học viên ${classTimetableDetailData.userWorkspace.fullname} đã được chấm điểm.`;

      const msg: SendMessageNotificationRabbit = {
        type: AppType.STUDENT,
        data: {
          category: CategoriesNotificationEnum.HOMEWORK,
          content: messageNotification,
          id: classTimetableDetailData.timetable.id,
          playerIds: _.uniq(playerIdsPush),
        },
      };
      await sendNotificationToRabbitMQ(msg);
      const newUserWorkspaceNotification = new UserWorkspaceNotifications();
      newUserWorkspaceNotification.content = messageNotification;
      newUserWorkspaceNotification.appType = AppType.STUDENT;
      newUserWorkspaceNotification.msg = JSON.stringify(msg);
      newUserWorkspaceNotification.detailId = `${classTimetableDetailData.timetable.id}`;
      newUserWorkspaceNotification.date = moment().toDate();
      newUserWorkspaceNotification.receiverUserWorkspaceId = classTimetableDetailData.userWorkspaceId;
      newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
      newUserWorkspaceNotification.workspaceId = classTimetableDetailData.userWorkspaceId;
      await UserWorkspaceNotifications.insert(newUserWorkspaceNotification);
    }
    return true;
  }
  public async updateStudentAttendance(item: UpdateStudentAttendanceDto, userWorkspaceId: number) {
    const timeTableData = await Timetables.findOne({
      where: {
        id: item.timetableId,
      },
      relations: [
        'class',
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.userWorkspace.userWorkspaceDevices',
      ],
    });
    if (!timeTableData?.id) {
      throw new Exception(ExceptionName.DATA_IS_EXIST, ExceptionCode.DATA_IS_EXIST);
    }

    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        if (item.attendanceNote) {
          await queryRunner.manager.getRepository(Timetables).save({
            id: timeTableData.id,
            attendanceNote: item.attendanceNote,
          });
        }
        const classTimetableDetailData: ClassTimetableDetails[] = timeTableData.classTimetableDetails;

        const bulkUpdateClassTimetableDetail: Partial<ClassTimetableDetails>[] = [];
        const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];

        const playerIdsPush: string[] = [];
        const messageNotification = `Học viên đã được điểm danh ở lớp ${timeTableData.class.name} buổi thứ ${
          timeTableData.sessionNumberOrder
        } ca học ${moment(timeTableData.fromTime, TimeFormat.time).format(TimeFormat.hours)} - ${moment(timeTableData.toTime, TimeFormat.time).format(
          TimeFormat.hours,
        )} ngày ${moment(timeTableData.date).format(TimeFormat.date)}`;

        const msg: SendMessageNotificationRabbit = {
          type: AppType.STUDENT,
          data: {
            category: CategoriesNotificationEnum.ATTENDANCE,
            content: messageNotification,
            id: timeTableData.id,
            playerIds: _.uniq(playerIdsPush),
          },
        };
        for (const userWorkspaceAttendanceItem of item.userWorkspaceAttendances) {
          const classTimetableDetailItem = classTimetableDetailData.find(el => el.userWorkspaceId === userWorkspaceAttendanceItem.userWorkspaceId);
          if (classTimetableDetailItem?.id) {
            bulkUpdateClassTimetableDetail.push({
              id: classTimetableDetailItem.id,
              learningStatus: LearningStatus.LEARNED,
              attendanceStatus: userWorkspaceAttendanceItem.status,
              attendanceNote: userWorkspaceAttendanceItem.note,
              attendanceByUserWorkspaceId: userWorkspaceId,
            });
            playerIdsPush.push(...classTimetableDetailItem.userWorkspace.userWorkspaceDevices.map(el => el.playerId));
            const newUserWorkspaceNotification = new UserWorkspaceNotifications();
            newUserWorkspaceNotification.content = messageNotification;
            newUserWorkspaceNotification.appType = AppType.STUDENT;
            newUserWorkspaceNotification.msg = JSON.stringify(msg);
            newUserWorkspaceNotification.detailId = `${timeTableData.id}`;
            newUserWorkspaceNotification.date = moment().toDate();
            newUserWorkspaceNotification.receiverUserWorkspaceId = classTimetableDetailItem.userWorkspaceId;
            newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
            newUserWorkspaceNotification.workspaceId = classTimetableDetailItem.workspaceId;
            bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
          }
        }
        msg.data.playerIds = _.uniq(playerIdsPush);
        await sendNotificationToRabbitMQ(msg);

        await queryRunner.manager.getRepository(ClassTimetableDetails).save(bulkUpdateClassTimetableDetail);
        await queryRunner.manager.getRepository(UserWorkspaceNotifications).insert(bulkCreateUserWorkspaceNotifications);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
  }
  public async updateEvaluationStudentInLesson(item: UpdateEvaluationInLessonDto, userWorkspaceId: number) {
    const timetableData = await Timetables.findOne({
      where: {
        id: item.timetableId,
      },
      relations: [
        'class',
        'classTimetableDetails',
        'classTimetableDetails.userWorkspace',
        'classTimetableDetails.userWorkspace.userWorkspaceDevices',
      ],
    });
    if (!timetableData?.id) {
      throw new Exception(ExceptionName.DATA_NOT_FOUND, ExceptionCode.DATA_NOT_FOUND);
    }
    const userWorkspaceIds: number[] = timetableData.classTimetableDetails.map(el => el.userWorkspaceId);

    if (!userWorkspaceIds.length) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_NOT_FOUND);
    }
    const updateUserWorkspaceIds = [...item.userWorkspacePublishIds, ...item.userWorkspacePrivateIds];
    if (updateUserWorkspaceIds.filter(x => !userWorkspaceIds.includes(x)).length) {
      throw new Exception(ExceptionName.USER_WORKSPACE_NOT_FOUND, ExceptionCode.USER_WORKSPACE_NOT_FOUND);
    }
    /**
     * validate evaluation data
     */
    const dailyEvaluationData = await DailyEvaluations.findOne({
      where: {
        id: timetableData?.class.dailyEvaluationId,
      },
      relations: ['evaluationCriterias', 'evaluationCriterias.evaluationOptionValues'],
    });
    if (!dailyEvaluationData?.id) {
      throw new Exception(ExceptionName.EVALUATION_NOT_FOUND, ExceptionCode.EVALUATION_NOT_FOUND);
    }
    const evaluationCriteriaData = dailyEvaluationData.evaluationCriterias;
    const updateEvaluationCriteria = item.evaluationDetails.map(el => el.evaluationCriteriaId);
    if (updateEvaluationCriteria.filter(el => !evaluationCriteriaData.map(el => el.id).includes(el)).length) {
      throw new Exception(ExceptionName.EVALUATION_NOT_FOUND, ExceptionCode.EVALUATION_NOT_FOUND);
    }
    const connection = await DbConnection.getConnection();
    if (connection) {
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      /**
       * push notification to student
       */
      const bulkCreateUserWorkspaceNotifications: UserWorkspaceNotifications[] = [];
      const playerIdsPush: string[] = timetableData.classTimetableDetails
        .map(el => el.userWorkspace.userWorkspaceDevices.map(element => element.playerId))
        .flat();
      const messageNotification = `Học viên đã được đánh giá ở lớp ${timetableData.class.name} buổi thứ ${
        timetableData.sessionNumberOrder
      } ca học ${moment(timetableData.fromTime, TimeFormat.time).format(TimeFormat.hours)} - ${moment(timetableData.toTime, TimeFormat.time).format(
        TimeFormat.hours,
      )} ngày ${moment(timetableData.date).format(TimeFormat.date)}`;

      const msg: SendMessageNotificationRabbit = {
        type: AppType.STUDENT,
        data: {
          category: CategoriesNotificationEnum.EVALUATION,
          content: messageNotification,
          id: timetableData.id,
          playerIds: _.uniq(playerIdsPush),
        },
      };

      try {
        const bulkCreateEvaluationTimetable: ClassTimetableDetailEvaluations[] = [];
        const bulkCreateEvaluationOptionTimetable: ClassTimetableDetailEvaluationOptions[] = [];
        const classTimetableDetailsData = timetableData.classTimetableDetails;
        for (const classTimetableDetailItem of classTimetableDetailsData) {
          if (!updateUserWorkspaceIds.includes(classTimetableDetailItem.userWorkspaceId)) {
            continue;
          }
          let isPublishEvaluation = false;
          if (item.userWorkspacePublishIds.includes(classTimetableDetailItem.userWorkspaceId)) {
            isPublishEvaluation = true;
          }
          await queryRunner.manager.getRepository(ClassTimetableDetails).update(classTimetableDetailItem.id, {
            evaluationByUserWorkspaceId: userWorkspaceId,
            evaluationPublish: isPublishEvaluation,
          });

          for (const updateEvaluationCriteria of item.evaluationDetails) {
            const evaluationCriteriaDataCurrent = evaluationCriteriaData.find(el => el.id === updateEvaluationCriteria.evaluationCriteriaId);
            if (!evaluationCriteriaDataCurrent) {
              throw new Exception(ExceptionName.EVALUATION_NOT_FOUND, ExceptionCode.EVALUATION_NOT_FOUND);
            }
            switch (evaluationCriteriaDataCurrent.type) {
              case EvaluationTypes.TEXT: {
                const newEvaluationTimetable = new ClassTimetableDetailEvaluations();
                newEvaluationTimetable.classTimetableDetailId = classTimetableDetailItem.id;
                newEvaluationTimetable.evaluationCriteriaId = evaluationCriteriaDataCurrent.id;
                newEvaluationTimetable.workspaceId = item.workspaceId;
                newEvaluationTimetable.textValue = updateEvaluationCriteria.value;
                bulkCreateEvaluationTimetable.push(newEvaluationTimetable);
                break;
              }
              case EvaluationTypes.SCORE: {
                if (Number(updateEvaluationCriteria.value) > evaluationCriteriaDataCurrent.maximumScore) {
                  throw new Exception(ExceptionName.SCORE_INVALID, ExceptionCode.SCORE_INVALID);
                }
                const newEvaluationTimetable = new ClassTimetableDetailEvaluations();
                newEvaluationTimetable.classTimetableDetailId = classTimetableDetailItem.id;
                newEvaluationTimetable.evaluationCriteriaId = evaluationCriteriaDataCurrent.id;
                newEvaluationTimetable.workspaceId = item.workspaceId;
                newEvaluationTimetable.scoreValue = Number(updateEvaluationCriteria.value);
                bulkCreateEvaluationTimetable.push(newEvaluationTimetable);
                break;
              }
              case EvaluationTypes.ONE_OPTION:
              case EvaluationTypes.MULTIPLE_OPTIONS: {
                const evaluationOptionValuesIds = evaluationCriteriaDataCurrent.evaluationOptionValues.map(el => el.id);
                if (updateEvaluationCriteria.evaluationOptionValueIds.filter(x => !evaluationOptionValuesIds.includes(x)).length) {
                  throw new Exception(ExceptionName.EVALUATION_OPTION_NOT_FOUND, ExceptionCode.EVALUATION_OPTION_NOT_FOUND);
                }
                const newEvaluationTimetable = new ClassTimetableDetailEvaluations();
                newEvaluationTimetable.classTimetableDetailId = classTimetableDetailItem.id;
                newEvaluationTimetable.evaluationCriteriaId = evaluationCriteriaDataCurrent.id;
                newEvaluationTimetable.workspaceId = item.workspaceId;
                const classTimetableDetailEvaluationCreate = await queryRunner.manager
                  .getRepository(ClassTimetableDetailEvaluations)
                  .insert(newEvaluationTimetable);

                for (const optionValue of updateEvaluationCriteria.evaluationOptionValueIds) {
                  const newEvaluationOptionTimetable = new ClassTimetableDetailEvaluationOptions();
                  newEvaluationOptionTimetable.classTimetableDetailEvaluationId = classTimetableDetailEvaluationCreate.identifiers[0]?.id;
                  newEvaluationOptionTimetable.evaluationOptionValueId = optionValue;
                  newEvaluationOptionTimetable.workspaceId = item.workspaceId;
                  bulkCreateEvaluationOptionTimetable.push(newEvaluationOptionTimetable);
                }
                break;
              }
            }
          }
          /**
           * push notification to student
           */
          const newUserWorkspaceNotification = new UserWorkspaceNotifications();
          newUserWorkspaceNotification.content = messageNotification;
          newUserWorkspaceNotification.appType = AppType.STUDENT;
          newUserWorkspaceNotification.msg = JSON.stringify(msg);
          newUserWorkspaceNotification.detailId = `${timetableData.id}`;
          newUserWorkspaceNotification.date = moment().toDate();
          newUserWorkspaceNotification.receiverUserWorkspaceId = classTimetableDetailItem.userWorkspaceId;
          newUserWorkspaceNotification.senderUserWorkspaceId = userWorkspaceId;
          newUserWorkspaceNotification.workspaceId = classTimetableDetailItem.workspaceId;
          bulkCreateUserWorkspaceNotifications.push(newUserWorkspaceNotification);
        }

        if (bulkCreateEvaluationTimetable.length) {
          await queryRunner.manager.getRepository(ClassTimetableDetailEvaluations).insert(bulkCreateEvaluationTimetable);
        }
        if (bulkCreateEvaluationOptionTimetable.length) {
          await queryRunner.manager.getRepository(ClassTimetableDetailEvaluationOptions).insert(bulkCreateEvaluationOptionTimetable);
        }

        await sendNotificationToRabbitMQ(msg);
        await queryRunner.manager.getRepository(UserWorkspaceNotifications).insert(bulkCreateUserWorkspaceNotifications);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
    return timetableData;
  }
}
