import { Module } from '@nestjs/common';
import { UsersDivisionsController } from './users-divisions.controller';
import { UsersDivisionsService } from './users-divisions.service';

@Module({
  controllers: [UsersDivisionsController],
  providers: [UsersDivisionsService]
})
export class UsersDivisionsModule {}

