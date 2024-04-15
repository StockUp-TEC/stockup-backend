import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('ROLE')
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ name: 'NAME' })
  @Field(() => String)
  name: string;

  @Column({ name: 'DESCRIPTION' })
  @Field(() => String)
  description: string;

  @Column({ name: 'WORKSPACE_ID' })
  @Field(() => ID)
  workspaceId: number;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'ROLE_PERMISSION',
    joinColumn: { name: 'ROLE_ID' },
    inverseJoinColumn: { name: 'PERMISSION_ID' },
  })
  permissions: Permission[];
}
