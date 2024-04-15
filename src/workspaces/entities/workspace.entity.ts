import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Division } from '../../divisions/entities/division.entity';
import { User } from '../../users/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Company } from '../../companies/entities/company.entity';

@Entity({ name: 'WORKSPACE' })
@ObjectType()
export class Workspace {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar2', name: 'DESCRIPTION', length: 1024 })
  @Field(() => String)
  description: string;

  @OneToMany(() => Division, (division) => division.workspace, { eager: true })
  @Field(() => [Division], { defaultValue: [] })
  divisions: Division[];

  @ManyToMany(() => User, (user) => user.workspaces, { eager: true })
  @JoinTable({
    name: 'USER_WORKSPACE',
    joinColumn: { name: 'WORKSPACE_ID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'USER_ID', referencedColumnName: 'id' },
  })
  @Field(() => [User], { defaultValue: [] })
  users: User[];

  @ManyToMany(() => Company, (company) => company.workspaces, { eager: true })
  @JoinTable({
    name: 'WORKSPACE_COMPANY',
    joinColumn: { name: 'WORKSPACE_ID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'COMPANY_ID', referencedColumnName: 'id' },
  })
  @Field(() => [Company], { defaultValue: [] })
  companies: Company[];
}
