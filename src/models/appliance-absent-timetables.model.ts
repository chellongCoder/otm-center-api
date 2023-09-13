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
import { ApplianceAbsents } from './appliance-absents.model';
import { Timetables } from './timetables.model';

@Entity('appliance_absent_timetables')
export class ApplianceAbsentTimetables extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'timetable_id' })
  timetableId: number;

  @Column({ name: 'appliance_absent_id' })
  applianceAbsentId: number;

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

  @ManyToOne(() => ApplianceAbsents, item => item.applianceAbsentTimetables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'appliance_absent_id' })
  applianceAbsent: ApplianceAbsents;

  @ManyToOne(() => Timetables)
  @JoinColumn({ name: 'timetable_id' })
  timetable: Timetables;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('appliance_absent_timetables');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`appliance_absent_timetables.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`appliance_absent_timetables.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
