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
  Index,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Workspaces } from './workspaces.model';
import { UserWorkspaceShiftScopes } from './user-workspace-shift-scopes.model';

export enum UserWorkspaceTypes {
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  STAFF = 'STAFF',
}
export enum SexTypes {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum StatusUserWorkspaces {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
}
export enum Languages {
  VI = 'VI',
  EN = 'EN',
}
@Entity('user_workspaces')
@Index(['workspaceId', 'userId', 'username'], { unique: true })
export class UserWorkspaces extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'nickname', nullable: true })
  nickname: string;

  @Column({ name: 'fullname', nullable: true })
  fullname: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ name: 'sex', nullable: true })
  sex: SexTypes;

  @Column({ name: 'lang', nullable: true })
  lang: Languages;

  @Column({ name: 'is_owner', default: false })
  isOwner: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'status', nullable: true })
  status: StatusUserWorkspaces;

  @Column({ name: 'zalo', nullable: true })
  zalo: string;

  @Column({ name: 'skype', nullable: true })
  skype: string;

  @Column({ name: 'class_name_leaning', nullable: true })
  classNameLeaning: string;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'ward_id', nullable: true })
  wardId: number;

  @Column({ name: 'birthplace', nullable: true })
  birthplace: string;

  @Column({ name: 'attach_image_url', nullable: true })
  attachImageUrl: string;

  @Column({ name: 'referral_source', nullable: true })
  referralSource: UserWorkspaceTypes;

  @Column({ name: 'presenter_id', nullable: true })
  presenterId: number;

  @Column({ name: 'school_name', nullable: true })
  schoolName: string;

  @Column({ name: 'note', nullable: true })
  note: string;

  @Column({ name: 'facebook', nullable: true })
  facebook: string;

  @Column({ name: 'user_workspace_type' })
  userWorkspaceType: UserWorkspaceTypes;

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

  @ManyToOne(() => Workspaces, workspaces => workspaces.userWorkspaces)
  @JoinColumn({ name: 'workspace_id' })
  public workspace: Workspaces;

  @OneToMany(() => UserWorkspaceShiftScopes, item => item.userWorkspace)
  public userWorkspaceShiftScopes: UserWorkspaceShiftScopes[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('user_workspaces');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`user_workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`user_workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
