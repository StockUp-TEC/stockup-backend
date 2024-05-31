import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @Column({ name: 'NEXT_STATUS_ID', nullable: true })
  nextStatusId: number;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;

  @OneToMany(() => Task, (task) => task.status)
  @Field(() => [Task], { defaultValue: [] })
  tasks: Task[];

  @OneToOne(() => Status, (status) => status.nextStatus)
  @JoinColumn({ name: 'NEXT_STATUS_ID' })
  nextStatus: Status;

  @Field(() => Int, { nullable: true })
  index?: number;
}
