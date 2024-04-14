import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDivision } from './user-division.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDivision]),
    TypeOrmModule.forFeature([User]),
  ],
})
export class UserDivisionModule {}
