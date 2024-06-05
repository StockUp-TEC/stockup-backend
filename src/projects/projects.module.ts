import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserDivisionsModule } from '../user-divisions/user-divisions.module';
import { UsersModule } from '../users/users.module';
import { ProjectHistory } from './entities/project-history.entity';
import { BackgroundsModule } from '../backgrounds/backgrounds.module';
import { StatusesModule } from '../statuses/statuses.module';

@Module({
  imports: [
    UserDivisionsModule,
    UsersModule,
    BackgroundsModule,
    StatusesModule,
    TypeOrmModule.forFeature([Project, ProjectHistory]),
  ],
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
