import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
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

  @Column({ name: 'PROJECT_ID' })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.statuses)
  @JoinColumn({ name: 'PROJECT_ID' })
  project: Project;

  @OneToMany(() => Task, (task) => task.status, { eager: true })
  @Field(() => [Task])
  tasks: Task[];
}
