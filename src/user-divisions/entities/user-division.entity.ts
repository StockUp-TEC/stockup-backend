import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Division } from '../../divisions/entities/division.entity';

@Entity('USER_DIVISION')
@ObjectType()
export class UserDivision {
  @PrimaryColumn({ name: 'USER_ID' })
  userId: number;

  @PrimaryColumn({ name: 'DIVISION_ID' })
  divisionId: number;

  @Column({ name: 'IS_ADMIN', default: false })
  @Field(() => Boolean)
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.userDivisions, { eager: true })
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Division, (division) => division.userDivisions)
  @JoinColumn({ name: 'DIVISION_ID' })
  division: Division;
}
