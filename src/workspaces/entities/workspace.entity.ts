import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Division } from '../../divisions/entities/division.entity';
import { User } from '../../users/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Company } from '../../companies/entities/company.entity';
import { UserWorkspace } from '../../user-workspaces/entities/user-workspace.entity';
import { Status } from '../../statuses/entities/status.entity';

@Entity({ name: 'WORKSPACE' })
@ObjectType()
export class Workspace {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar2', name: 'DESCRIPTION', length: 1024 })
  @Field(() => String)
  description: string;

  @Column({ type: 'varchar2', name: 'COLOR' })
  @Field(() => String)
  color: string;

  @OneToMany(() => Division, (division) => division.workspace)
  @Field(() => [Division], { defaultValue: [] })
  divisions: Division[];

  @ManyToMany(() => User, (user) => user.workspaces)
  @JoinTable({
    name: 'USER_WORKSPACE',
    joinColumn: { name: 'WORKSPACE_ID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'USER_ID', referencedColumnName: 'id' },
  })
  @Field(() => [User], { defaultValue: [] })
  users: User[];

  @OneToMany(() => Company, (company) => company.workspace)
  @Field(() => [Company], { defaultValue: [] })
  companies: Company[];

  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.workspace)
  userWorkspaces: UserWorkspace[];
}
