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
import { ClassTimetableDetails } from './class-timetable-details.model';

export enum AssignmentTypes {
  LINK = 'LINK',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}
@Entity('class_timetable_detail_assignments')
export class ClassTimetableDetailAssignments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_timetable_detail_id' })
  classTimetableDetailId: number;

  @Column({ name: 'type' })
  type: AssignmentTypes;

  @Column({ name: 'link' })
  link: string;

  @Column({ name: 'note', nullable: true })
  note: string;

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

  @ManyToOne(() => ClassTimetableDetails, item => item.classTimetableDetailAssignments)
  @JoinColumn({ name: 'class_timetable_detail_id' })
  classTimetableDetail: ClassTimetableDetails;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('class_timetable_detail_assignments');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`class_timetable_detail_assignments.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`class_timetable_detail_assignments.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
