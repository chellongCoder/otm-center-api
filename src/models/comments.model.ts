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
import { UserWorkspaces } from './user-workspaces.model';

export enum CategoriesCommentsEnum {
  APPLIANCE_ABSENT = 'APPLIANCE_ABSENT',
  EVALUATION = 'EVALUATION',
  HOMEWORK = 'HOMEWORK',
  SCHEDULE_CLASS = 'SCHEDULE_CLASS',
  NEW_POST = 'NEW_POST',
  NOTIFICATION = 'NOTIFICATION',
}
@Entity('comments')
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'category' })
  category: CategoriesCommentsEnum;

  @Column({ name: 'target_key', nullable: true })
  targetKey: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'url', nullable: true })
  url: string;

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

  @OneToMany(() => Comments, item => item.rootComment, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subComments: Comments[];

  @ManyToOne(() => Comments, item => item.subComments)
  @JoinColumn({ name: 'parent_id' })
  rootComment: Comments;

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'user_workspace_id' })
  userWorkspace: UserWorkspaces;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('comments');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`comments.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`comments.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
