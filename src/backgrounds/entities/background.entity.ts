import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('BACKGROUND')
@ObjectType()
export class Background {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'FROM_COLOR' })
  @Field(() => String)
  fromColor: string;

  @Column({ name: 'TO_COLOR' })
  @Field(() => String)
  toColor: string;
}
