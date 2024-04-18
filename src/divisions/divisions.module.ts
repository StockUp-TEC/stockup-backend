import { Module } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { DivisionsResolver } from './divisions.resolver';
import { Division } from './entities/division.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { UserDivisionsModule } from '../user-divisions/user-divisions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Division]),
    TypeOrmModule.forFeature([Workspace]),
    UserDivisionsModule,
  ],
  providers: [DivisionsResolver, DivisionsService],
})
export class DivisionsModule {}
