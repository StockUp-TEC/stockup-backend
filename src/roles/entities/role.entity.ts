import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserWorkspace } from '../../user-workspaces/entities/user-workspace.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ROLE')
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  @Column({ name: 'AUTH0_ROLE_ID' })
  auth0RoleId: string;

  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.role)
  userWorkspaces: UserWorkspace[];

  @Field(() => [User], { defaultValue: [] })
  users: User[];
}
