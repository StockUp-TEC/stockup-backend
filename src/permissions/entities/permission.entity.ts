import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PermissionGroup } from '../../permission-groups/entities/permission-group.entity';
import { JoinColumn, ManyToOne } from 'typeorm';
import { PermissionType } from '../../permission-types/entities/permission-type.entity';

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

  @ManyToOne(() => PermissionType)
  @JoinColumn({ name: 'PERMISSION_TYPE_ID', referencedColumnName: 'ID' })
  @Field(() => PermissionType)
  permissionType: PermissionType;
}
