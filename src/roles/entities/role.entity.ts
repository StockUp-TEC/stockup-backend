import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ROLE')
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  @Column({ name: 'WORKSPACE_ID' })
  @Field(() => ID)
  workspaceId: number;

  @Column({ name: 'AUTH0_ROLE_ID' })
  auth0RoleId: string;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: 'ROLE_PERMISSION',
    joinColumn: { name: 'ROLE_ID' },
    inverseJoinColumn: { name: 'PERMISSION_ID' },
  })
  @Field(() => [Permission])
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: 'USER_WORKSPACE', // Specify the table name that contains the relationship
    joinColumn: { name: 'ROLE_ID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'USER_ID', referencedColumnName: 'id' },
  })
  @Field(() => [User])
  users: User[];
}
