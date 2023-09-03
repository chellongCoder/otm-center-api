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
import { Posts } from './posts.model';

export enum PostMediaTypes {
  IMAGE_ORIGIN = 'IMAGE_ORIGIN', // ảnh upload trực tiếp
  IMAGE_PATH = 'IMAGE_PATH', // ảnh từ đường dẫn
  VIDEO_PATH = 'VIDEO_PATH', // video  từ đường dẫn
  OTHER_PATH = 'OTHER_PATH', // khác
}
/**
 * save data of post attach media files
 */
@Entity('post_medias')
export class PostMedias extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'link' })
  link: string;

  @Column({ name: 'type' })
  type: PostMediaTypes;

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

  @ManyToOne(() => Posts, item => item.postMedias)
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('post_medias');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`post_medias.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`post_medias.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
