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
  OneToOne,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Classes } from './classes.model';
import { Shifts } from './shifts.model';
import { ClassShiftsClassrooms } from './class-shifts-classrooms.model';
import { ClassLessons } from './class-lessons.model';
import { ClassLectures } from './class-lectures.model';

@Entity('timetables')
export class Timetables extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_lesson_id' })
  classLessonId: number;

  @Column({ name: 'class_lecture_id' })
  classLectureId: number;

  @Column({ name: 'shift_id' })
  shiftId: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'class_shifts_classroom_id' })
  classShiftsClassroomId: number;

  @Column({ name: 'date' })
  date: Date;

  @Column('time', { name: 'from_time' })
  fromTime: Date;

  @Column('time', { name: 'to_time' })
  toTime: Date;

  @Column({ name: 'valid_date' })
  validDate: Date;

  @Column({ name: 'expires_date', nullable: true })
  expiresDate: Date;

  @Column({ name: 'session_number_order' }) // số thứ tự buổi học
  sessionNumberOrder: number;

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

  @ManyToOne(() => Classes, item => item.timetables)
  @JoinColumn({ name: 'class_id' })
  class: Classes;

  @ManyToOne(() => Shifts)
  @JoinColumn({ name: 'shift_id' })
  shift: Shifts;

  @ManyToOne(() => ClassShiftsClassrooms)
  @JoinColumn({ name: 'class_shifts_classroom_id' })
  classShiftsClassroom: ClassShiftsClassrooms;

  @OneToOne(() => ClassLessons)
  @JoinColumn({ name: 'class_lesson_id' })
  classLesson: ClassLessons;

  @OneToOne(() => ClassLectures)
  @JoinColumn({ name: 'class_lecture_id' })
  classLecture: ClassLectures;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('timetables');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`timetables.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`timetables.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
