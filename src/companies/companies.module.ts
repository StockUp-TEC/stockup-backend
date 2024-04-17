import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  providers: [CompaniesResolver, CompaniesService],
})
export class CompaniesModule {}
