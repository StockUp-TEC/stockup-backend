import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'DIVISION' })
export class Division {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  name: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  created_at: Date;

  @Column({ type: 'varchar2', name: 'DESCRIPTION' })
  description: string;

  @Column({ name: 'WORKSPACE_ID' })
  workspaceId: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.id)
  @JoinColumn({ name: 'WORKSPACE_ID' })
  workspace: Workspace;
}
