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
import { ApplianceAbsentTimetables } from './appliance-absent-timetables.model';
import { UserWorkspaces } from './user-workspaces.model';

export enum AbsentStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCEL = 'CANCEL',
  NOT_APPROVED = 'NOT_APPROVED',
}
@Entity('appliance_absents')
export class ApplianceAbsents extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'note' })
  note: string;

  @Column({ name: 'status', default: AbsentStatus.NOT_APPROVED })
  status: AbsentStatus;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'update_by_user_workspace_id' })
  updateByUserWorkspaceId: number;

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

  @OneToMany(() => ApplianceAbsentTimetables, item => item.applianceAbsent)
  public applianceAbsentTimetables: ApplianceAbsentTimetables[];

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'update_by_user_workspace_id' })
  userWorkspace: UserWorkspaces;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('appliance_absents');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`appliance_absents.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`appliance_absents.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
