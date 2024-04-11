import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'USER' })
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ type: 'varchar2', name: 'EMAIL' })
  email: string;
}
