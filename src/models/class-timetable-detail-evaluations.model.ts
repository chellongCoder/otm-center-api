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
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ClassTimetableDetails } from './class-timetable-details.model';
import { ClassTimetableDetailEvaluationOptions } from './class-timetable-detail-evaluation-options.model';
import { EvaluationCriterias } from './evaluation-criterias.model';
/**
 * Đánh giá học viên trong buổi học của lớp
 */
@Entity('class_timetable_detail_evaluations')
export class ClassTimetableDetailEvaluations extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_timetable_detail_id' })
  classTimetableDetailId: number;

  @Column({ name: 'evaluation_criteria_id' })
  evaluationCriteriaId: number;

  @Column({ name: 'score_value', nullable: true })
  scoreValue: number;

  @Column({ name: 'text_value', nullable: true })
  textValue: string;

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

  @ManyToOne(() => ClassTimetableDetails, item => item.classTimetableDetailEvaluations)
  @JoinColumn({ name: 'class_timetable_detail_id' })
  classTimetableDetail: ClassTimetableDetails;

  @OneToMany(() => ClassTimetableDetailEvaluationOptions, item => item.classTimetableDetailEvaluation, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public classTimetableDetailEvaluationOptions: ClassTimetableDetailEvaluationOptions[];

  @ManyToOne(() => EvaluationCriterias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evaluation_criteria_id' })
  evaluationCriteria: EvaluationCriterias;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('class_timetable_detail_evaluations');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`class_timetable_detail_evaluations.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`class_timetable_detail_evaluations.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
