import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('EVIDENCE')
@ObjectType()
export class Evidence {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  @Field(() => Date)
  createdAt: Date;

  @Column({ name: 'CREATED_BY' })
  @Field(() => Int)
  createdBy: number;
}
