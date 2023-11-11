import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Timetables } from './timetables.model';
import { UserWorkspaces } from './user-workspaces.model';
import { ClassTimetableDetailEvaluations } from './class-timetable-detail-evaluations.model';
import { ClassTimetableDetailAssignments } from './class-timetable-detail-assignments.model';

export enum AttendanceStatus {
  ON_TIME = 'ON_TIME', // ĐÚNG GIỜ
  LATE = 'LATE', // MUỘN
  ABSENT_WITH_LEAVE = 'ABSENT_WITH_LEAVE', // NGHỈ CÓ PHÉP
  ABSENT = 'ABSENT', // NGHỈ KHÔNG PHÉP
  ABSENT_REMOVED = 'ABSENT_REMOVED',
}

export enum LearningStatus {
  UNLEARNED = 'UNLEARNED', // CHƯA HỌC
  LEARNED = 'LEARNED', // ĐÃ HỌC
}
/**
 * Thông tin chi tiết buổi học
 */
@Entity('class_timetable_details')
export class ClassTimetableDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'timetable_id' })
  timetableId: number;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'learning_status', default: LearningStatus.UNLEARNED })
  learningStatus: LearningStatus;

  @Column({ name: 'attendance_status', nullable: true })
  attendanceStatus: AttendanceStatus;

  @Column({ name: 'attendance_note', nullable: true })
  attendanceNote: string;

  @Column({ name: 'attendance_by_user_workspace_id', nullable: true })
  attendanceByUserWorkspaceId: number;

  @Column({ name: 'homework_assignment', nullable: true })
  homeworkAssignment: string;

  @Column({ name: 'homework_assignment_time', nullable: true })
  homeworkAssignmentTime: Date;

  @Column({ name: 'homework_score', nullable: true })
  homeworkScore: number;

  @Column({ name: 'homework_assessment', nullable: true })
  homeworkAssessment: string;

  @Column({ name: 'homework_by_user_workspace_id', nullable: true }) // giáo viên chấm điểm
  homeworkByUserWorkspaceId: number;

  @Column({ name: 'evaluation_by_user_workspace_id', nullable: true }) // giáo viên publish đánh giá
  evaluationByUserWorkspaceId: number;

  @Column({ name: 'evaluation_publish', default: false })
  evaluationPublish: boolean;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  @Expose({ name: 'deleted_at' })
  deletedAt?: Date;

  @ManyToOne(() => Timetables, item => item.classTimetableDetails)
  @JoinColumn({ name: 'timetable_id' })
  timetable: Timetables;

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'user_workspace_id' })
  userWorkspace: UserWorkspaces;

  @OneToMany(() => ClassTimetableDetailEvaluations, item => item.classTimetableDetail)
  public classTimetableDetailEvaluations: ClassTimetableDetailEvaluations[];

  @OneToMany(() => ClassTimetableDetailAssignments, item => item.classTimetableDetail)
  public classTimetableDetailAssignments: ClassTimetableDetailAssignments[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('class_timetable_details');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`class_timetable_details.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`class_timetable_details.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
