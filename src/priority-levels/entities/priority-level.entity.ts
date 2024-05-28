import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PRIORITY_LEVEL' })
@ObjectType()
export class PriorityLevel {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'NAME' })
  @Field()
  name: string;

  @Column({ name: 'LEVEL' })
  @Field(() => Int)
  level: number;
}
