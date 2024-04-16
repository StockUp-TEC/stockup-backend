import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('PERMISSION_GROUP')
@ObjectType()
export class PermissionGroup {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  @OneToMany(() => Permission, (permission) => permission.permissionGroup, {
    eager: true,
  })
  @Field(() => [Permission], { defaultValue: [] })
  permissions: Permission[];
}
