import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'COMPANY' })
@ObjectType()
export class Company {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  @Field(() => String)
  name: string;

  @ManyToMany(() => User, (user) => user.companies)
  @JoinTable({
    name: 'USER_COMPANY',
    joinColumn: { name: 'COMPANY_ID' },
    inverseJoinColumn: { name: 'USER_ID' },
  })
  @Field(() => [User], { defaultValue: [] })
  users: User[];

  @ManyToMany(() => Workspace, (workspace) => workspace.companies)
  workspaces: Workspace[];
}
