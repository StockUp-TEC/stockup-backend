import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity({ name: 'STATUS' })
@ObjectType()
export class Status {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'COLOR' })
  @Field(() => String)
  color: string;

  @Column({ name: 'WORKSPACE_ID' })
  workspaceId: number;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;

  @OneToMany(() => Task, (task) => task.status)
  @Field(() => [Task])
  tasks: Task[];
}
