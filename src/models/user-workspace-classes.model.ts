import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

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

  @Column({ name: 'status', nullable: true })
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

  static findByCond(query: any) {
    const queryBuider = this.createQueryBuilder('user_workspace_classes');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`user_workspace_classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`user_workspace_classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
