import { Module } from '@nestjs/common';
import { BackgroundsService } from './backgrounds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Background } from './entities/background.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Background])],
  providers: [BackgroundsService],
  exports: [BackgroundsService],
})
export class BackgroundsModule {}
