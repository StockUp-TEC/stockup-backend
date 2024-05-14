import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserDivisionsModule } from '../user-divisions/user-divisions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UserDivisionsModule,
    UsersModule,
    TypeOrmModule.forFeature([Project]),
  ],
  providers: [ProjectsResolver, ProjectsService],
})
export class ProjectsModule {}
