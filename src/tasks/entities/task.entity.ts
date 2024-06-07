import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Status } from '../../statuses/entities/status.entity';
import { User } from '../../users/entities/user.entity';
import { PriorityLevel } from '../../priority-levels/entities/priority-level.entity';
import { TaskHistory } from './task-history.entity';

@Entity({ name: 'TASK' })
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field()
  id: number;

  @Column({ name: 'NAME' })
  @Field()
  name: string;

  @Column({ name: 'DESCRIPTION' })
  @Field({ nullable: true })
  description: string;

  @Column({ name: 'STATUS_ID' })
  statusId: number;

  @Column({ name: 'PROJECT_ID' })
  projectId: number;

  @Column({ name: 'ASSIGNED_ID' })
  assignedId: number;

  @Column({ name: 'DUE_DATE' })
  @Field({ nullable: true })
  dueDate: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  @Field()
  createdAt: Date;

  @Column({ name: 'CREATED_BY' })
  @Field()
  createdBy: number;

  @Column({ name: 'EFFORT' })
  @Field({ nullable: true })
  effort: number;

  @Column({ name: 'PRIORITY_ID' })
  priorityId: number;

  @Column({ name: 'PARENT_TASK_ID' })
  parentTaskId: number;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'PROJECT_ID' })
  project: Project;

  @ManyToOne(() => Status, (status) => status.tasks, { eager: true })
  @JoinColumn({ name: 'STATUS_ID' })
  @Field(() => Status)
  status: Status;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  @JoinColumn({ name: 'ASSIGNED_ID' })
  @Field(() => User, { nullable: true })
  assignedUser: User;

  @ManyToOne(() => PriorityLevel)
  @JoinColumn({ name: 'PRIORITY_ID' })
  @Field({ nullable: true })
  priority: PriorityLevel;

  @OneToMany(() => TaskHistory, (taskHistory) => taskHistory.task, {
    eager: true,
  })
  @Field(() => [TaskHistory], { defaultValue: [] })
  history: TaskHistory[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'CREATED_BY' })
  createdByUser: User;

  @ManyToOne(() => Task, (task) => task.subTasks, { nullable: true })
  @JoinColumn({ name: 'PARENT_TASK_ID' })
  parentTask: Task;

  @OneToMany(() => Task, (task) => task.parentTask)
  @Field(() => [Task], { defaultValue: [] })
  subTasks: Relation<Task[]>;
}
