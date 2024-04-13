import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

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

  @Column({ name: 'WORKSPACE_ID' })
  @Field(() => ID)
  workspaceId: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.id)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  @Field(() => Workspace)
  workspace: Workspace;
}
