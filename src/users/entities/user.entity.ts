import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDivision } from '../../user-divisions/entities/user-division.entity';

@Entity({ name: 'USER' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar2', name: 'EMAIL' })
  @Field(() => String)
  email: string;

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  @Field(() => [Workspace])
  workspaces: Workspace[];

  @OneToMany(() => UserDivision, (userDivision) => userDivision.user)
  userDivisions: UserDivision[];
}
