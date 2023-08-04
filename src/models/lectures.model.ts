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
import { Courses } from './courses.model';

/**
 * Bài giảng - được tạo tự động khi khoá học được tạo
 */
@Entity('lectures')
export class Lectures extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'lesson_id' })
  lessonId: number;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'exercise', nullable: true })
  exercise: string;

  @Column({ name: 'equipment', nullable: true })
  equipment: string;

  @Column({ name: 'is_use_name', default: false }) //Sử dụng tên của bài học
  isUseName: boolean;

  @Column({ name: 'lecture_file_id', nullable: true })
  lectureFileId: number;

  @Column({ name: 'course_id' })
  courseId: number;

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

  @ManyToOne(() => Courses, (course: Courses) => course.lectures)
  @JoinColumn({ name: 'course_id' })
  course: Courses;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('lectures');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`lectures.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`lectures.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
