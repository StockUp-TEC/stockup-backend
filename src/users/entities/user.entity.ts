import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDivision } from '../../user-divisions/entities/user-division.entity';
import { Company } from '../../companies/entities/company.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'USER' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar2', name: 'EMAIL' })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar2', name: 'NAME' })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ type: 'varchar2', name: 'STUDENT_ID' })
  @Field(() => String)
  studentId: string;

  @Column({ type: 'varchar2', name: 'AUTH_PROVIDER_ID' })
  authProviderId: string;

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  @Field(() => [Workspace], { defaultValue: [] })
  workspaces: Workspace[];

  @OneToMany(() => UserDivision, (userDivision) => userDivision.user)
  userDivisions: UserDivision[];

  @ManyToMany(() => Company, (company) => company.users)
  companies: Company[];

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
