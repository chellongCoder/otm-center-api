import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('user_workspace_devices')
export class UserWorkspaceDevices extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'device_name' })
  deviceName: string;

  @Column({ name: 'device_id' })
  deviceId: number;

  @Column({ name: 'fcm_push_token' })
  fcmPushToken: string;

  @Column({ name: 'device_platform' })
  devicePlatform: string;

  @Column({ name: 'is_emulator' })
  isEmulator: boolean;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

  @Column({ name: 'workspace_id' })
  workspaceId: number;

  @Column({ name: 'is_active' })
  isActive: boolean;

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
    const queryBuider = this.createQueryBuilder('user_workspace_devices');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuider.where(`user_workspace_devices.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuider.andWhere(`user_workspace_devices.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuider.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
