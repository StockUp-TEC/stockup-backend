import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Status } from '../../statuses/entities/status.entity';

@Entity({ name: 'TASK' })
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field()
  id: number;

  @Column({ name: 'NAME' })
  @Field()
  name: string;

  @Column({ name: 'STATUS_ID' })
  statusId: number;

  @Column({ name: 'PROJECT_ID' })
  projectId: number;

  @Column({ name: 'ASSIGNED_ID' })
  assignedId: number;

  @Column({ name: 'DUE_DATE' })
  @Field()
  dueDate: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  @Field()
  createdAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'PROJECT_ID' })
  project: Project;

  @ManyToOne(() => Status, (status) => status.tasks)
  @JoinColumn({ name: 'STATUS_ID' })
  status: Status;
}
