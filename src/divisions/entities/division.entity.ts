import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDivision } from '../../user-divisions/entities/user-division.entity';

@Entity({ name: 'DIVISION' })
@ObjectType()
export class Division {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  @Field(() => String)
  name: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  @Field(() => Date)
  created_at: Date;

  @Column({ type: 'varchar2', name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  // Column that references the workspace ID
  @Column({ name: 'WORKSPACE_ID' })
  workspaceId: number;

  // Many-to-one relationship with the workspace entity
  @ManyToOne(() => Workspace, (workspace) => workspace.divisions)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;

  // One-to-many relationship with the user-division entity
  @OneToMany(() => UserDivision, (userDivision) => userDivision.division, {
    eager: true,
  })
  @Field(() => [UserDivision])
  userDivisions: UserDivision[];
}
