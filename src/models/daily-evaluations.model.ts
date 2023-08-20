import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { EvaluationCriterias } from './evaluation-criterias.model';

@Entity('daily_evaluations')
export class DailyEvaluations extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

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

  @OneToMany(() => EvaluationCriterias, item => item.dailyEvaluation)
  public evaluationCriterias: EvaluationCriterias[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('daily_evaluations');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`daily_evaluations.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`daily_evaluations.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    const result = queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
    const [sql, parameters] = queryBuilder.getQueryAndParameters();

    // Log the raw SQL query
    console.log('Raw SQL Query:', sql);
    console.log('Parameters:', parameters);
    return result;
  }
}
