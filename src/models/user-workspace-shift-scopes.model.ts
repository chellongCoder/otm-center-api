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
import { ClassShiftsClassrooms } from './class-shifts-classrooms.model';
import { UserWorkspaces } from './user-workspaces.model';

export enum TitleShiftScopes {
  TEACHER = 'TEACHER',
  TUTORS = 'TUTORS',
}
@Entity('user_workspace_shift_scopes')
export class UserWorkspaceShiftScopes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'class_shifts_classroom_id' })
  classShiftsClassroomsId: number;

  @Column({ name: 'valid_date' })
  validDate: Date;

  @Column({ name: 'expires_date', nullable: true })
  expiresDate: Date;

  @Column({ name: 'title' })
  title: TitleShiftScopes;

  @Column('time', { name: 'from_time' })
  fromTime: Date;

  @Column('time', { name: 'to_time' })
  toTime: Date;

  @Column({ name: 'note', nullable: true })
  note: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

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

  @ManyToOne(() => ClassShiftsClassrooms)
  @JoinColumn({ name: 'class_shifts_classroom_id' })
  classShiftsClassroom: ClassShiftsClassrooms;

  @ManyToOne(() => UserWorkspaces, item => item.userWorkspaceShiftScopes)
  @JoinColumn({ name: 'user_workspace_id' })
  userWorkspace: UserWorkspaces;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('user_workspace_shift_scopes');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`user_workspace_shift_scopes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`user_workspace_shift_scopes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
/**
 * validate thời gian bắt đầu kết thúc của giáo viên trong thời gian ca
 * validate thông tin lớp tại thời gian đó có ca chưa
 *
 */
