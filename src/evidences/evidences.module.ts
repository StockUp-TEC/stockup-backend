import { Module } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { EvidencesResolver } from './evidences.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evidence } from './entities/evidence.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evidence]), UsersModule],
  providers: [EvidencesResolver, EvidencesService],
})
export class EvidencesModule {}
