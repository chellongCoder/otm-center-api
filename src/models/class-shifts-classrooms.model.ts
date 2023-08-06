import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserWorkspaceShiftScopes } from './user-workspace-shift-scopes.model';
import { Shifts } from './shifts.model';
import { Classrooms } from './classrooms.model';

/**
 * đăng ký lịch
 */
@Entity('class_shifts_classrooms')
export class ClassShiftsClassrooms extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'shift_id' })
  shiftId: number;

  @Column({ name: 'classroom_id' })
  classroomId: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'valid_date' })
  validDate: Date;

  @Column({ name: 'expires_date', nullable: true })
  expiresDate: Date;

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

  @OneToMany(() => UserWorkspaceShiftScopes, item => item.classShiftsClassroom, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userWorkspaceShiftScopes: UserWorkspaceShiftScopes[];

  @ManyToOne(() => Shifts)
  @JoinColumn({ name: 'shift_id' })
  shift: Shifts;

  @ManyToOne(() => Classrooms)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classrooms;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('class_shifts_classrooms');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`class_shifts_classrooms.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`class_shifts_classrooms.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
