import { Classes } from '@/models/classes.model';
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
import { Workspaces } from './workspaces.model';
import { Courses } from './courses.model';

export enum classScheduleTypes {
  ALL = 'ALL',
  SPECIAL = 'SPECIAL',
}
export enum UserWorkspaceClassTypes {
  UNLEARNED = 'UNLEARNED', //chưa học
  STUDYING = 'STUDYING', //đang học
  RESERVE = 'RESERVE', //bảo lưu
  CHANGE = 'CHANGE', //chuyển lớp
  DONE = 'DONE', //đã xong
  DROPOUT = 'DROPOUT', //bỏ học
}

@Entity('user_workspace_classes')
export class UserWorkspaceClasses extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'from_date' })
  fromDate: Date;

  @Column({ name: 'session_number', nullable: true })
  sessionNumber: number;

  @Column({ name: 'note', nullable: true })
  note: string;

  @Column({ name: 'status', nullable: true, default: UserWorkspaceClassTypes.UNLEARNED })
  status: UserWorkspaceClassTypes;

  @Column({ name: 'class_schedule_type', default: classScheduleTypes.ALL }) //Chọn lịch học * ALL áp dụng với tất cả ca học
  classScheduleType: classScheduleTypes;

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

  @ManyToOne(() => Classes, item => item.userWorkspaceClasses)
  @JoinColumn({ name: 'class_id' })
  classes: Classes;

  @ManyToOne(() => Workspaces, item => item.userWorkspaceClasses)
  @JoinColumn({ name: 'workspace_id' })
  workspaces: Workspaces;

  @ManyToOne(() => Courses, item => item.userWorkspaceClasses)
  @JoinColumn({ name: 'course_id' })
  courses: Courses;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('user_workspace_classes');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`user_workspace_classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`user_workspace_classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
