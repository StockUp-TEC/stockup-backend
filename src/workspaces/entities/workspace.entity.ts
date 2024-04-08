import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'WORKSPACE' })
export class Workspace {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  name: string;

  @Column({ type: 'varchar2', name: 'DESCRIPTION' })
  description: string;
}
