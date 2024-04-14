import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Division } from '../divisions/entities/division.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity('USER_DIVISION')
@ObjectType()
export class UserDivision {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.userDivisions)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Division)
  @Field(() => Division)
  division: Division;
}
