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
import { UserWorkspaces } from './user-workspaces.model';

export enum PaymentMethodInvoices {
  CO_WALLET = 'CO_WALLET',
  CASH = 'CASH',
  BANKING = 'BANKING',
}
@Entity('invoices')
export class Invoices extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code' }) // mã hợp đồng
  code: string;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'date' }) // ngày tạo
  date: Date;

  @Column({ name: 'due_date_payment' }) // hạn đóng
  dueDatePayment: Date;

  @Column({ name: 'total_payment', default: 0 }) // tổng tiền
  totalPayment: number;

  @Column({ name: 'paid_money', default: 0 }) // đã đóng
  paidMoney: number;

  @Column({ name: 'discount', default: 0 }) // giảm giá
  discount: number;

  @Column({ name: 'current_paid', default: 0 }) // đóng trong hoá đơn này
  currentPaid: number;

  @Column({ name: 'payment_method', default: PaymentMethodInvoices.CASH }) // phương thức thanh toán
  paymentMethod: PaymentMethodInvoices;

  @Column({ name: 'created_by_user_workspace_id' })
  createdByUserWorkspaceId: number;

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

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'user_workspace_id' })
  userWorkspace: UserWorkspaces;

  @ManyToOne(() => UserWorkspaces)
  @JoinColumn({ name: 'created_by_user_workspace_id' })
  createdByUserWorkspace: UserWorkspaces;

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('invoices');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`invoices.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`invoices.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
