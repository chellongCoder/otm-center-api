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
import { AnnouncementUserWorkspaces } from './announcement-user-workspaces.model';
import { Workspaces } from './workspaces.model';
import { FavoriteUserWorkspaces } from './favorite-user-workspaces.model';

@Entity('announcements')
export class Announcements extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'created_by_user_workspace_id' })
  createdByUserWorkspaceId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'url', nullable: true })
  url: string;

  @Column({ name: 'is_important', default: false })
  isImportant: boolean;

  @Column({ name: 'allow_comment', default: true })
  allowComment: boolean;

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

  @OneToMany(() => AnnouncementUserWorkspaces, item => item.announcement)
  public announcementUserWorkspaces: AnnouncementUserWorkspaces[];

  @OneToMany(() => FavoriteUserWorkspaces, item => item.announcement, {
    cascade: true,
  })
  public favoriteUserWorkspaces: FavoriteUserWorkspaces[];

  @ManyToOne(() => Workspaces)
  @JoinColumn({ name: 'workspace_id' })
  public workspace: Workspaces;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('announcements');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`announcements.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`announcements.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
