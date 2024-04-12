import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'USER' })
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ type: 'varchar2', name: 'EMAIL' })
  email: string;

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  workspaces: Workspace[];
}
