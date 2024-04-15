import { Module } from '@nestjs/common';
import { UserDivisionsService } from './user-divisions.service';
import { UserDivisionsResolver } from './user-divisions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDivision } from './entities/user-division.entity';
import { User } from '../users/entities/user.entity';
import { Division } from '../divisions/entities/division.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDivision]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Division]),
  ],
  providers: [UserDivisionsResolver, UserDivisionsService],
})
export class UserDivisionsModule {}
