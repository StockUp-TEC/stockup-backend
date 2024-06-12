import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Status } from '../../statuses/entities/status.entity';
import { User } from '../../users/entities/user.entity';
import { PriorityLevel } from '../../priority-levels/entities/priority-level.entity';

@Entity({ name: 'TASK_HISTORY' })
@ObjectType()
export class TaskHistory {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field()
  id: number;

  @CreateDateColumn({ name: 'UPDATED_AT' })
  @Field()
  updatedAt: Date;

  @Column({ name: 'NEW_NAME' })
  @Field()
  newName: string;

  @Column({ name: 'NEW_DUE_DATE' })
  @Field()
  newDueDate: Date;

  @Column({ name: 'PREVIOUS_NAME' })
  @Field()
  previousName: string;

  @Column({ name: 'PREVIOUS_DUE_DATE' })
  @Field()
  previousDueDate: Date;

  @Column({ name: 'NEW_DESCRIPTION' })
  @Field()
  newDescription: string;

  @Column({ name: 'PREVIOUS_DESCRIPTION' })
  @Field()
  previousDescription: string;

  @Column({ name: 'NEW_EFFORT' })
  @Field(() => Int)
  newEffort: number;

  @Column({ name: 'PREVIOUS_EFFORT' })
  @Field(() => Int)
  previousEffort: number;

  @Column({ name: 'UPDATED_BY' })
  @Field()
  updatedBy: number;

  @Column({ name: 'TASK_ID' })
  taskId: number;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'TASK_ID' })
  task: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'UPDATED_BY' })
  @Field(() => User)
  updatedByUser: User;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'PREVIOUS_STATUS_ID' })
  @Field(() => Status)
  previousStatus: Status;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'NEW_STATUS_ID' })
  @Field(() => Status)
  newStatus: Status;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'NEW_ASSIGNED_ID' })
  @Field(() => User)
  newAssignedUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'PREVIOUS_ASSIGNED_ID' })
  @Field(() => User)
  previousAssignedUser: User;

  @ManyToOne(() => PriorityLevel)
  @JoinColumn({ name: 'PREVIOUS_PRIORITY_ID' })
  @Field(() => PriorityLevel)
  previousPriority: PriorityLevel;

  @ManyToOne(() => PriorityLevel)
  @JoinColumn({ name: 'NEW_PRIORITY_ID' })
  @Field(() => PriorityLevel)
  newPriority: PriorityLevel;
}
