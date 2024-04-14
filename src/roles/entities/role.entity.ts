import { ObjectType, Field, ID } from '@nestjs/graphql';
import { JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@ObjectType()
export class Role {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'ROLE_PERMISSION',
    joinColumn: { name: 'ROLE_ID', referencedColumnName: 'ID' },
    inverseJoinColumn: { name: 'PERMISSION_ID', referencedColumnName: 'ID' },
  })
  permissions: Permission[];
}
