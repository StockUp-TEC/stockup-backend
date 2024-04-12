import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Division } from '../../divisions/entities/division.entity';

@Entity({ name: 'USERS_DIVISIONS' })
export class UsersDivisions {
  @PrimaryColumn({ name: 'USER_ID' })
  userId: number;

  @PrimaryColumn({ name: 'DIVISION_ID' })
  divisionId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @ManyToOne(() => Division)
  @JoinColumn({ name: 'DIVISION_ID' })
  division: Division;
}
