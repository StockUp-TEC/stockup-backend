import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Project } from '../../projects/entities/project.entity';

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

  @Column({ name: 'PROJECT_ID' })
  projectId: number;

  @Column({ name: 'NEXT_STATUS_ID', nullable: true })
  nextStatusId: number;

  @ManyToOne(() => Project, (project) => project.statuses)
  @JoinColumn({ name: 'PROJECT_ID' })
  project: Project;

  @OneToMany(() => Task, (task) => task.status)
  @Field(() => [Task], { defaultValue: [] })
  tasks: Task[];

  @OneToOne(() => Status, (status) => status.nextStatus)
  @JoinColumn({ name: 'NEXT_STATUS_ID' })
  nextStatus: Status;

  @Field(() => Int, { nullable: true })
  index?: number;
}
