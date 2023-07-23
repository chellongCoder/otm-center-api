import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('notification_messages')
export class NotificationMessages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'body' })
  body: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'metadata' })
  metadata: string;

  @Column({ name: 'firebase_push_type' })
  firebasePushType: string;

  @Column({ name: 'date' })
  date: Date;

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

  static findByCond(query: any) {
    const queryBuider = this.createQueryBuilder('notification_messages');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`notification_messages.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`notification_messages.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
