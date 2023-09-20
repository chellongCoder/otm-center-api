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
import { DailyEvaluations } from './daily-evaluations.model';
import { EvaluationOptionValues } from './evaluation-option-values.model';

export enum EvaluationTypes {
  SCORE = 'SCORE',
  TEXT = 'TEXT',
  ONE_OPTION = 'ONE_OPTION',
  MULTIPLE_OPTIONS = 'MULTIPLE_OPTIONS',
}
@Entity('evaluation_criterias')
export class EvaluationCriterias extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'type' })
  type: EvaluationTypes;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'maximum_score', nullable: true })
  maximumScore: number;

  @Column({ name: 'daily_evaluation_id' })
  dailyEvaluationId: number;

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

  @ManyToOne(() => DailyEvaluations, item => item.evaluationCriterias)
  @JoinColumn({ name: 'daily_evaluation_id' })
  public dailyEvaluation: DailyEvaluations;

  @OneToMany(() => EvaluationOptionValues, item => item.evaluationCriteria, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public evaluationOptionValues: EvaluationOptionValues[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('evaluation_criterias');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`evaluation_criterias.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`evaluation_criterias.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
