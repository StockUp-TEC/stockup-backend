import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('USER_WORKSPACE')
@ObjectType()
export class UserWorkspace {
  @PrimaryColumn({ name: 'USER_ID' })
  @Field(() => ID)
  userId: number;

  @PrimaryColumn({ name: 'WORKSPACE_ID' })
  @Field(() => ID)
  workspaceId: number;

  @Column({ name: 'ROLE_ID' })
  @Field(() => ID)
  roleId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'ROLE_ID' })
  role: Role;
}
