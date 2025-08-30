import { BaseEntity } from 'incident-management-commons';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity, JoinColumn, ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserAppTypeEntity } from './user-app-type.entity';

@Entity({ name: 'user_app' })
export class UserAppEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'user_app_id',
    type: 'int',
    default: () => "nextval('e_user.seq_user_app')",
  })
  userAppId: number;

  @Column({ name: 'name', type: 'varchar', length: 25 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 25 })
  email: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', length: 75 })
  password: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => UserAppTypeEntity, (uat) => uat.users)
  @JoinColumn({ name: 'user_type_code' })
  userType: UserAppTypeEntity;

  @BeforeInsert()
  setBothDates() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdateAt() {
    this.updatedAt = new Date();
  }
}
