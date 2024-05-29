import { forwardRef, Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesResolver } from './statuses.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Status]),
    ProjectsModule,
    forwardRef(() => TasksModule),
  ],
  providers: [StatusesResolver, StatusesService],
  exports: [StatusesService],
})
export class StatusesModule {}
