import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserWorkspaces } from './user-workspaces.model';
export enum AppType {
  TEACHER = 'teacher',
  STUDENT = 'student',
}
export enum NotificationStatus {
  NEW = 'NEW',
  SEEN = 'SEEN',
}
@Entity('user_workspace_notifications')
export class UserWorkspaceNotifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'detail_id', nullable: true })
  detailId: string;

  @Column({ name: 'msg', nullable: true })
  msg: string;

  @Column({ name: 'status', default: NotificationStatus.NEW })
  status: NotificationStatus;

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

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'receiver_user_workspace_id' })
  receiverUserWorkspace: UserWorkspaces;

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'sender_user_workspace_id' })
  senderUserWorkspace: UserWorkspaces;

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
