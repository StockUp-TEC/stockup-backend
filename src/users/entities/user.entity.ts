import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'USER' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar2', name: 'EMAIL' })
  @Field(() => String)
  email: string;

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  @Field(() => [Workspace])
  workspaces: Workspace[];
}
