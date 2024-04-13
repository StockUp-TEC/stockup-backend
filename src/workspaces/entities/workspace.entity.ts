import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  // OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Division } from '../../divisions/entities/division.entity';
import { User } from '../../users/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'WORKSPACE' })
@ObjectType()
export class Workspace {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar2', name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  // @OneToMany(() => Division, (division) => division.workspace)
  // divisions: Division[];

  @ManyToMany(() => User, (user) => user.workspaces)
  @JoinTable()
  @Field(() => [User])
  users: User[];
}
