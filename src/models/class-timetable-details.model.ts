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
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Timetables } from './timetables.model';
import { UserWorkspaces } from './user-workspaces.model';

@Entity('class_timetable_details')
export class ClassTimetableDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'timetable_id' })
  timetableId: number;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'attendance_status', nullable: true })
  attendanceStatus: string;

  @Column({ name: 'attendance_note', nullable: true })
  attendanceNote: string;

  @Column({ name: 'attendance_by_user_workspace_id', nullable: true })
  attendanceByUserWorkspaceId: number;

  @Column({ name: 'homework_assignment', nullable: true })
  homeworkAssignment: string;

  @Column({ name: 'homework_score', nullable: true })
  homeworkScore: number;

  @Column({ name: 'homework_assessment', nullable: true })
  homeworkAssessment: string;

  @Column({ name: 'homework_by_user_workspace_id', nullable: true })
  homeworkByUserWorkspaceId: string;

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
