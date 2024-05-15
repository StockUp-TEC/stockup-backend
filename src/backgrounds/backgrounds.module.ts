import { Module } from '@nestjs/common';
import { BackgroundsService } from './backgrounds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Background } from './entities/background.entity';
import { BackgroundsResolver } from './backgrounds.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Background])],
  providers: [BackgroundsService, BackgroundsResolver],
  exports: [BackgroundsService],
})
export class BackgroundsModule {}
