import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDivision } from '../../user-divisions/entities/user-division.entity';
import { Company } from '../../companies/entities/company.entity';
import { UserWorkspace } from '../../user-workspaces/entities/user-workspace.entity';

@Entity({ name: 'USER' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => Int)
  id: number;

  @Column({ name: 'EMAIL' })
  @Field(() => String)
  email: string;

  @Column({ name: 'NAME' })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ name: 'STUDENT_ID' })
  @Field(() => String, { nullable: true })
  studentId: string;

  @Column({ name: 'PHONE_NUMBER' })
  @Field(() => String, { nullable: true })
  phoneNumber: string;

  @Column({ name: 'AUTH_PROVIDER_ID' })
  authProviderId: string;

  @Column({ name: 'IMAGE_URL' })
  @Field(() => String, { nullable: true })
  imageUrl: string;

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  @Field(() => [Workspace], { defaultValue: [] })
  workspaces: Workspace[];

  @OneToMany(() => UserDivision, (userDivision) => userDivision.user)
  @Field(() => [UserDivision], { defaultValue: [] })
  userDivisions: UserDivision[];

  @ManyToMany(() => Company, (company) => company.users)
  companies: Company[];

  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.user)
  userWorkspaces: UserWorkspace[];
}
