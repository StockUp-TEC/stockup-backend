import { Module } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { DivisionsResolver } from './divisions.resolver';
import { Division } from './entities/division.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Division]),
    TypeOrmModule.forFeature([Workspace]),
  ],
  providers: [DivisionsResolver, DivisionsService],
})
export class DivisionsModule {}
