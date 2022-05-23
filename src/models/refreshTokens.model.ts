import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  UpdateDateColumn,
  ManyToOne,
  IsNull,
} from "typeorm";
import { Account } from "./accounts.model";

@Entity("refresh_tokens")
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (acc) => acc.refreshTokens)
  account: Account;

  @Column()
  token: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  static findByToken(token: string) {
    return this.findOne({
      where: { token: token, deletedAt: IsNull() },
      relations: ["account"],
    });
  }

  static findByAccount(id: number) {
    return this.findOne({
      where: { account: { id }, deletedAt: IsNull() },
    });
  }
}
