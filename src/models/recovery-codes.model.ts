import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';

@Entity('recovery_codes')
export class RecoveryCodes extends BaseEntity {
  constructor(_email?: string, _code?: string, _forgotUrl?: string, _errorUrl?: string) {
    super();
    this.email = _email || '';
    this.code = _code || '';
    this.forgotUrl = _forgotUrl || '';
    this.errorUrl = _errorUrl || '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column({ default: false })
  used: boolean;

  @Column()
  forgotUrl: string;

  @Column()
  errorUrl: string;

  @Column({ name: 'expired_at' })
  expiredAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude()
  deletedAt?: Date;

  static findByEmailAndCode(email: string, code: string) {
    return this.findOneBy({ email: email, code: code });
  }
}
