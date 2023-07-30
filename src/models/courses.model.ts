import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export enum PaymentMethodTypes {
  BY_COURSE = 'BY_COURSE',
  BY_SESSION = 'BY_SESSION',
  BY_MONTH = 'BY_MONTH',
}
@Entity('courses')
export class Courses extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'number_of_lesson' })
  numberOfLesson: number;

  @Column({ name: 'payment_method' })
  paymentMethod: PaymentMethodTypes;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'hours_of_lesson' })
  hoursOfLesson: number;

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'subject' })
  subject: string;

  @Column({ name: 'unit' })
  unit: number;

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

  static findByCond(query: any) {
    const queryBuider = this.createQueryBuilder('courses');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`courses.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`courses.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
