import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ShiftWeekdays } from './shift-weekdays.model';

@Entity('shifts')
export class Shifts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('time', { name: 'from_time' })
  fromTime: Date;

  @Column('time', { name: 'to_time' })
  toTime: Date;

  @Column({ name: 'is_everyday' })
  isEveryday: boolean;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

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

  @OneToMany(() => ShiftWeekdays, item => item.shift, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public shiftWeekdays: ShiftWeekdays[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('shifts');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`shifts.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`shifts.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
