import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'COMPANY' })
export class Company {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  name: string;
}
