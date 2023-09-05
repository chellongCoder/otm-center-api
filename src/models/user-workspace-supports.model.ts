import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserWorkspaceSupportImages } from './user-workspace-support-images.model';

export enum SupportStatus {
  NEW_REQUEST = 'NEW_REQUEST',
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
}

export enum SupportResponseStatus {
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
}

export enum SupportTypes {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}
export enum SupportStudentTypes {
  COMPlAIN = 'COMPlAIN',
  SUPPORT = 'SUPPORT',
}
@Entity('user_workspace_supports')
export class UserWorkspaceSupports extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'type' })
  type: SupportTypes;

  @Column({ name: 'support_student_type', nullable: true })
  supportStudentType: SupportStudentTypes;

  @Column({ name: 'status', default: SupportStatus.NEW_REQUEST })
  status: SupportStatus;

  @Column({ name: 'response_status', default: SupportResponseStatus.PENDING })
  responseStatus: SupportResponseStatus;

  @Column({ name: 'user_workspace_id' })
  userWorkspaceId: number;

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

  @OneToMany(() => UserWorkspaceSupportImages, item => item.userWorkspaceSupport)
  public userWorkspaceSupportImages: UserWorkspaceSupportImages[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('user_workspace_supports');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`user_workspace_supports.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`user_workspace_supports.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
