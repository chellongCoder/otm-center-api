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
import { Contracts } from './contracts.model';
import { Courses } from './courses.model';

@Entity('contract_courses')
export class ContractCourses extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contract_id' })
  contractId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'discount' })
  discount: number;

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

  @ManyToOne(() => Contracts, item => item.contractCourses)
  @JoinColumn({ name: 'contract_id' })
  public contract: Contracts;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: 'course_id' })
  public course: Courses;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('contract_courses');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`contract_courses.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`contract_courses.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
