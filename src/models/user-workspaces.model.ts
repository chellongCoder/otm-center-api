import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('user_workspaces')
export class UserWorkspaces extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'fullname' })
  fullname: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'sex' })
  sex: string;

  @Column({ name: 'lang' })
  lang: string;

  @Column({ name: 'is_owner' })
  isOwner: string;

  @Column({ name: 'is_active' })
  isActive: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'avatar' })
  avatar: string;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'zalo' })
  zalo: string;

  @Column({ name: 'skype' })
  skype: string;

  @Column({ name: 'class_name_leaning' })
  classNameLeaning: string;

  @Column({ name: 'city_id' })
  cityId: number;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column({ name: 'ward_id' })
  wardId: number;

  @Column({ name: 'birthplace' })
  birthplace: string;

  @Column({ name: 'attach_image_url' })
  attachImageUrl: string;

  @Column({ name: 'referral_source' })
  referralSource: string;

  @Column({ name: 'presenter_id' })
  presenterId: number;

  @Column({ name: 'school_name' })
  schoolName: string;

  @Column({ name: 'note' })
  note: string;

  @Column({ name: 'facebook' })
  facebook: string;

  @Column({ name: 'user_type' })
  userType: string;

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
    const queryBuider = this.createQueryBuilder('user_workspaces');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`user_workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`user_workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
