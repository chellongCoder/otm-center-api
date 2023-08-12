import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('class_lectures')
export class ClassLectures extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_number_order' })
  sessionNumberOrder: number;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'exercise', nullable: true })
  exercise: string;

  @Column({ name: 'equipment', nullable: true })
  equipment: string;

  @Column({ name: 'is_use_name', nullable: true })
  isUseName: boolean;

  @Column({ name: 'class_id' })
  classId: number;

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
    const queryBuilder = this.createQueryBuilder('class_lectures');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`class_lectures.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`class_lectures.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}