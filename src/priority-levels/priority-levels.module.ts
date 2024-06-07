import { Module } from '@nestjs/common';
import { PriorityLevelsService } from './priority-levels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriorityLevel } from './entities/priority-level.entity';
import { PriorityLevelsResolver } from './priority-levels.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PriorityLevel])],
  providers: [PriorityLevelsResolver, PriorityLevelsService],
  exports: [PriorityLevelsService],
})
export class PriorityLevelsModule {}
