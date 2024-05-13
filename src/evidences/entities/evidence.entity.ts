import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'USER_EVIDENCE',
    joinColumn: { name: 'EVIDENCE_ID' },
    inverseJoinColumn: { name: 'USER_ID' },
  })
  @Field(() => [User])
  users: User[];
}
