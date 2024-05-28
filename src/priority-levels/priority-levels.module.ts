import { Module } from '@nestjs/common';
import { PriorityLevelsService } from './priority-levels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriorityLevel } from './entities/priority-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriorityLevel])],
  providers: [PriorityLevelsService],
  exports: [PriorityLevelsService],
})
export class PriorityLevelsModule {}
