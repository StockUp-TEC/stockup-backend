import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PermissionGroup } from '../../permission-groups/entities/permission-group.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('PERMISSION')
@ObjectType()
export class Permission {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  @ManyToOne(() => PermissionGroup)
  @JoinColumn({ name: 'PERMISSION_GROUP_ID' })
  @Field(() => PermissionGroup)
  permissionGroup: PermissionGroup;

  @Column({ name: 'IS_ADMIN' })
  @Field(() => Boolean)
  isAdmin: boolean;
}
