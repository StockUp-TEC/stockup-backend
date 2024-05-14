import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Division } from '../../divisions/entities/division.entity';
import { Status } from '../../statuses/entities/status.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('PROJECT')
@ObjectType()
export class Project {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  @Field(() => Date)
  createdAt: Date;

  @Column({ name: 'DUE_DATE' })
  @Field()
  dueDate: Date;

  @Column({ name: 'DIVISION_ID' })
  divisionId: number;

  @Column({ name: 'BACKGROUND_ID' })
  backgroundId: number;

  @Column({ name: 'IS_COMPLETED' })
  @Field(() => Boolean)
  isCompleted: boolean;

  @ManyToOne(() => Division, (division) => division.projects)
  @JoinColumn({ name: 'DIVISION_ID' })
  division: Division;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'USER_PROJECT',
    joinColumn: { name: 'PROJECT_ID' },
    inverseJoinColumn: { name: 'USER_ID' },
  })
  @Field(() => [User], { name: 'users' })
  users: User[];

  @OneToMany(() => Status, (status) => status.project, { eager: true })
  @Field(() => [Status])
  statuses: Status[];

  @OneToMany(() => Task, (task) => task.project, { eager: true })
  @Field(() => [Task])
  tasks: Task[];
}
