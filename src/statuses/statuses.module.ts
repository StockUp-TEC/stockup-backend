import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesResolver } from './statuses.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusesResolver, StatusesService],
  exports: [StatusesService],
})
export class StatusesModule {}
