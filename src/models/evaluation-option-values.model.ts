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
import { EvaluationCriterias } from './evaluation-criterias.model';

@Entity('evaluation_option_values')
export class EvaluationOptionValues extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'value' })
  value: string;

  @Column({ name: 'evaluation_criteria_id' })
  evaluationCriteriaId: number;

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

  @ManyToOne(() => EvaluationCriterias, item => item.evaluationOptionValues)
  @JoinColumn({ name: 'evaluation_criteria_id' })
  evaluationCriteria: EvaluationCriterias;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('evaluation_option_values');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`evaluation_option_values.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`evaluation_option_values.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
