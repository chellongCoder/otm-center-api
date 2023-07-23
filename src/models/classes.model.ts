import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('classes')
export class Classes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'from_time' })
  fromTime: Date;

  @Column({ name: 'to_time' })
  toTime: Date;

  @Column({ name: 'attended_number' })
  attendedNumber: number;

  @Column({ name: 'session_number' })
  sessionNumber: number;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'status' })
  status: string;

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
    const queryBuider = this.createQueryBuilder('classes');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`classes.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
