import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'COMPANY' })
@ObjectType()
export class Company {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar2', name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  @Column({ type: 'number', name: 'WORKSPACE_ID' })
  workspaceId: number;

  @ManyToMany(() => User, (user) => user.companies, { eager: true })
  @JoinTable({
    name: 'USER_COMPANY',
    joinColumn: { name: 'COMPANY_ID' },
    inverseJoinColumn: { name: 'USER_ID' },
  })
  @Field(() => [User], { defaultValue: [] })
  users: User[];

  @ManyToOne(() => Workspace, (workspace) => workspace.companies)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;
}
