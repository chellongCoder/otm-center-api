import bcrypt from "bcrypt";
import { Exclude, ExcludeOptions } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { RefreshToken } from "./refreshTokens.model";

@Entity("accounts")
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @CreateDateColumn({ name: "created_at" })
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Exclude()
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  @Exclude()
  deletedAt?: Date;

  @OneToMany(() => RefreshToken, (rt) => rt.account)
  refreshTokens: RefreshToken[];

  static findById(id: number) {
    return this.findOneBy({ id: id });
  }

  static findByEmail(email: string) {
    return this.findOneBy({ email: email });
  }

  @BeforeInsert()
  async setPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
