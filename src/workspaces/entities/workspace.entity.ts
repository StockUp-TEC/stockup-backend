import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Division } from "../../divisions/entities/division.entity";

@Entity({ name: 'WORKSPACE' })
export class Workspace {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  name: string;

  @Column({ type: 'varchar2', name: 'DESCRIPTION' })
  description: string;

  @OneToMany(() => Division, (division) => division.workspace)
  divisions: Division[];
}
