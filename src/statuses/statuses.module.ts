import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesResolver } from './statuses.resolver';

@Module({
  providers: [StatusesResolver, StatusesService],
})
export class StatusesModule {}
