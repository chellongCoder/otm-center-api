import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserWorkspaceClasses } from './user-workspace-classes.model';

export enum StatusClasses {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
@Entity('classes')
export class Classes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'from_time' })
  fromTime: Date;

  @Column({ name: 'to_time', nullable: true })
  toTime: Date;

  @Column({ name: 'attended_number', nullable: true }) // số buổi Đã học
  attendedNumber: number;

  @Column({ name: 'session_number' }) // số buổi
  sessionNumber: number;

  @Column({ name: 'session_of_vietnamese_teacher', nullable: true }) //Số buổi giáo viên Việt Nam
  sessionOfVietnameseTeacher: number;

  @Column({ name: 'session_of_foreign_teacher', nullable: true }) //Số buổi giáo viên nước ngoài
  sessionOfForeignTeacher: number;

  @Column({ name: 'maximum_student', nullable: true }) //Số HV tối đa
  maximumStudent: number;

  @Column({ name: 'maximum_student_session', nullable: true }) //Số HV tối đa mỗi buổi
  maximumStudentSession: number;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'note', nullable: true })
  note: string;

  @Column({ name: 'status', nullable: true, default: StatusClasses.ACTIVE })
  status: StatusClasses;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'daily_evaluation_id' })
  dailyEvaluationId: number;

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

  @OneToMany(() => UserWorkspaceClasses, item => item.classes)
  public userWorkspaceClasses: UserWorkspaceClasses[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('classes');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
