import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Division } from '../../divisions/entities/division.entity';

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

  @Column({ name: 'ASSIGNED_ID' })
  assignedId: number;

  @ManyToOne(() => Division)
  @JoinColumn({ name: 'DIVISION_ID' })
  division: Division;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ASSIGNED_ID' })
  @Field(() => User)
  user: User;
}
