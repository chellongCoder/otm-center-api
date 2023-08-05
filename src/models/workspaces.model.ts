import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, BaseEntity, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserWorkspaces } from './user-workspaces.model';
import { UserWorkspaceClasses } from './user-workspace-classes.model';

@Entity('workspaces')
export class Workspaces extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code', nullable: true })
  code: string;

  @Column({ name: 'host', unique: true })
  host: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'name_slug', nullable: true })
  nameSlug: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'hierarchy_level' })
  hierarchyLevel: number;

  @Column({ name: 'is_active', default: true })
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

  @OneToMany(() => UserWorkspaces, item => item.workspace)
  public userWorkspaces: UserWorkspaces[];

  @OneToMany(() => UserWorkspaceClasses, item => item.workspace)
  public userWorkspaceClasses: UserWorkspaceClasses[];

  static findByCond(query: any) {
    const queryBuilder = this.createQueryBuilder('workspaces');
    if (query.search && query.search.length > 0) {
      for (let i = 0; i < query.search.length; i++) {
        const element = query.search[i];
        if (i === 0) {
          queryBuilder.where(`workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        } else {
          queryBuilder.andWhere(`workspaces.${element.key} ${element.opt} :${i}`).setParameter(i.toString(), element.value);
        }
      }
    }
    return queryBuilder.orderBy(query.sort, query.order).skip(query.skip).take(query.take).getManyAndCount();
  }
}
