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
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDivision } from '../../user-divisions/entities/user-division.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity({ name: 'DIVISION' })
@ObjectType()
export class Division {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
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
  @Field(() => [UserDivision], { name: 'users' })
  userDivisions: UserDivision[];

  @OneToMany(() => Project, (project) => project.division, { eager: true })
  @Field(() => [Project])
  projects: Project[];
}
