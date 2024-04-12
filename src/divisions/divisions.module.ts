import { Module } from '@nestjs/common';
import { DivisionsController } from './divisions.controller';
import { DivisionsService } from './divisions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from './entities/division.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Division]),
    TypeOrmModule.forFeature([Workspace]),
  ],
  controllers: [DivisionsController],
  providers: [DivisionsService],
})
export class DivisionsModule {}
