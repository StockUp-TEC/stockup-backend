import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('PROJECT_HISTORY')
@ObjectType()
export class ProjectHistory {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'PROJECT_ID' })
  projectId: number;

  @Column({ name: 'REASON' })
  @Field(() => String)
  reason: string;

  @CreateDateColumn({ name: 'UPDATED_AT' })
  @Field(() => Date)
  updatedAt: Date;

  @Column({ name: 'UPDATED_BY' })
  updatedBy: number;

  @Column({ name: 'PREVIOUS_DUE_DATE' })
  @Field(() => Date)
  previousDueDate: Date;

  @Column({ name: 'NEW_DUE_DATE' })
  @Field(() => Date)
  newDueDate: Date;

  @ManyToOne(() => Project, (project) => project.history)
  @JoinColumn({ name: 'PROJECT_ID' })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'UPDATED_BY' })
  @Field(() => User)
  updatedByUser: User;
}
