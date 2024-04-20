import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('USER_WORKSPACE')
@ObjectType()
export class UserWorkspace {
  @PrimaryColumn({ name: 'USER_ID' })
  userId: number;

  @PrimaryColumn({ name: 'WORKSPACE_ID' })
  @Field(() => ID)
  workspaceId: number;

  @Column({ name: 'ROLE_ID' })
  roleId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.userWorkspaces)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'ROLE_ID' })
  @Field(() => Role, { nullable: true })
  role: Role;
}
