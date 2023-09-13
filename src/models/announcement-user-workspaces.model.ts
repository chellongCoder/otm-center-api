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
import { UserWorkspaces } from './user-workspaces.model';
import { Announcements } from './announcements.model';

@Entity('announcement_user_workspaces')
export class AnnouncementUserWorkspaces extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'announcement_id' })
  announcementId: number;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

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

  @ManyToOne(() => Announcements, item => item.announcementUserWorkspaces)
  @JoinColumn({ name: 'announcement_id' })
  announcement: Announcements;

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'user_workspace_id' })
  userWorkspace: UserWorkspaces;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('announcement_user_workspaces');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`announcement_user_workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`announcement_user_workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
