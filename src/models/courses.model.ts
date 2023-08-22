import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Lessons } from './lessons.model';
import { Lectures } from './lectures.model';
import { Classes } from './classes.model';

export enum PaymentMethodTypes {
  BY_COURSE = 'BY_COURSE',
  BY_SESSION = 'BY_SESSION',
  BY_MONTH = 'BY_MONTH',
}
export enum UnitCourseType {
  ALL = 'ALL',
  SPECIAL = 'SPECIAL',
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
  unit: UnitCourseType;

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

  @OneToMany(() => Lessons, item => item.course, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public lessons: Lessons[];

  @OneToMany(() => Lectures, item => item.course, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public lectures: Lectures[];

  @OneToMany(() => Classes, item => item.course, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  classes: Classes[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('courses');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`courses.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`courses.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
