import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('events')
export class Events extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'image' })
  image: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'maximum_register' })
  maximumRegister: number;

  @Column({ name: 'from_time' })
  fromTime: Date;

  @Column({ name: 'to_time' })
  toTime: Date;

  @Column({ name: 'register_from_time' })
  registerFromTime: Date;

  @Column({ name: 'register_to_time' })
  registerToTime: Date;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'is_important' })
  isImportant: boolean;

  @Column({ name: 'schedule_send' })
  scheduleSend: Date;

  @Column({ name: 'scope_send' })
  scopeSend: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

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
    const queryBuider = this.createQueryBuilder('events');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`events.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`events.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
