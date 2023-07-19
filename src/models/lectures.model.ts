import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('lectures')
export class Lectures extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'lesson_id' })
  lessonId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'exercise' })
  exercise: string;

  @Column({ name: 'equipment' })
  equipment: string;

  @Column({ name: 'is_use_name' })
  isUseName: boolean;

  @Column({ name: 'lecture_file_id' })
  lectureFileId: string;

  @Column({ name: 'curriculum_id' })
  curriculumId: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

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
    const queryBuider = this.createQueryBuilder('lectures');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`lectures.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`lectures.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
