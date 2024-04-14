import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PermissionGroup } from '../../permission-groups/entities/permission-group.entity';
import { JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
export class Permission {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @ManyToOne(() => PermissionGroup)
  @JoinColumn({ name: 'PERMISSION_GROUP_ID', referencedColumnName: 'ID' })
  @Field(() => PermissionGroup)
  permissionGroup: PermissionGroup;

  @Field(() => Boolean)
  isAdmin: boolean;
}
