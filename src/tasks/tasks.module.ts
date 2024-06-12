import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { PriorityLevelsModule } from '../priority-levels/priority-levels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskHistory]),
    UsersModule,
    forwardRef(() => ProjectsModule),
    PriorityLevelsModule,
  ],
  providers: [TasksResolver, TasksService],
  exports: [TasksService],
})
export class TasksModule {}
