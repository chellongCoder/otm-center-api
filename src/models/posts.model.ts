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
import { PostUserWorkspaces } from './post-user-workspaces.model';
import { PostMedias } from './post-medias.model';
import { UserWorkspaces } from './user-workspaces.model';
import { FavoriteUserWorkspaces } from './favorite-user-workspaces.model';
import { Classes } from './classes.model';

@Entity('posts')
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'allow_comment', default: true })
  allowComment: boolean;

  @Column({ name: 'is_pin', default: false })
  isPin: boolean;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'by_user_workspace_id' })
  byUserWorkspaceId: number;

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

  @OneToMany(() => PostUserWorkspaces, item => item.post, {
    cascade: true,
  })
  public postUserWorkspaces: PostUserWorkspaces[];

  @OneToMany(() => PostMedias, item => item.post, {
    cascade: true,
  })
  public postMedias: PostMedias[];

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'by_user_workspace_id' })
  byUserWorkspace: UserWorkspaces;

  @ManyToOne(() => Classes)
  @JoinColumn({ name: 'class_id' })
  class: Classes;

  @OneToMany(() => FavoriteUserWorkspaces, item => item.post, {
    cascade: true,
  })
  public favoriteUserWorkspaces: FavoriteUserWorkspaces[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('posts');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`posts.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`posts.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
