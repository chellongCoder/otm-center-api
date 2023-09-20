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
import { ClassTimetableDetailEvaluations } from './class-timetable-detail-evaluations.model';
import { EvaluationOptionValues } from './evaluation-option-values.model';

@Entity('class_timetable_detail_evaluation_options')
export class ClassTimetableDetailEvaluationOptions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_timetable_detail_evaluation_id' })
  classTimetableDetailEvaluationId: number;

  @Column({ name: 'evaluation_option_value_id' })
  evaluationOptionValueId: number;

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

  @ManyToOne(() => ClassTimetableDetailEvaluations, item => item.classTimetableDetailEvaluationOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_timetable_detail_evaluation_id' })
  classTimetableDetailEvaluation: ClassTimetableDetailEvaluations;

  @ManyToOne(() => EvaluationOptionValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evaluation_option_value_id' })
  evaluationOptionValue: EvaluationOptionValues;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('class_timetable_detail_evaluation_options');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder
            .where(`class_timetable_detail_evaluation_options.${element.key} ${element.opt} :${i}`)
            .setParameter(i.toString(), element.value);
        } else {
          queryBuilder
            .andWhere(`class_timetable_detail_evaluation_options.${element.key} ${element.opt} :${i}`)
            .setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
