import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
export enum AppType {
  TEACHER = 'teacher',
  STUDENT = 'student',
}
@Entity('user_workspace_notifications')
export class UserWorkspaceNotifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'status', nullable: true })
  status: string;

  @Column({ name: 'firebase_push_type', nullable: true })
  firebasePushType: string;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'app_type' })
  appType: AppType;

  @Column({ name: 'notification_content_id', nullable: true })
  notificationContentId: number;

  @Column({ name: 'receiver_user_workspace_id' })
  receiverUserWorkspaceId: number;

  @Column({ name: 'sender_user_workspace_id', nullable: true })
  senderUserWorkspaceId: number;

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
    const queryBuilder = this.createQueryBuilder('user_workspace_notifications');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`user_workspace_notifications.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`user_workspace_notifications.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
