import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { UpdateTaskInput } from './dto/update-task.input';
import { CreateTaskInput } from './dto/create-task.input';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { PriorityLevelsService } from '../priority-levels/priority-levels.service';
import { StatusesService } from '../statuses/statuses.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskHistory)
    private taskHistoryRepository: Repository<TaskHistory>,
    private readonly userService: UsersService,
    private readonly projectService: ProjectsService,
    @Inject(forwardRef(() => StatusesService))
    private readonly statusService: StatusesService,
    private readonly priorityService: PriorityLevelsService,
  ) {}

  async create(authId: string, createTaskInput: CreateTaskInput) {
    const currentUser = await this.userService.me(authId);
    // Verify assigned user exists
    await this.userService.findOne(createTaskInput.assignedId);
    // Verify project exists
    await this.projectService.findOne(createTaskInput.projectId);
    // Verify status exists
    await this.statusService.findOne(createTaskInput.statusId);
    // Verify priority exists
    if (createTaskInput.priorityId)
      await this.priorityService.findOne(createTaskInput.priorityId);

    const newTask = this.taskRepository.create({
      ...createTaskInput,
      createdBy: currentUser.id,
    });
    return this.taskRepository.save(newTask);
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  findAllForProject(projectId: number) {
    return this.taskRepository.find({ where: { projectId } });
  }

  async update(authId: string, updateTaskInput: UpdateTaskInput) {
    const { id, ...input } = updateTaskInput;
    const queryRunner =
      this.taskRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const currentUser = await this.userService.me(authId);
      const existingTask = await queryRunner.manager.findOne(Task, {
        where: { id },
      });
      if (!existingTask) {
        throw new Error(`Task with id ${id} not found`);
      }

      const differences = Object.keys(input).reduce((acc, key) => {
        if (existingTask[key] !== input[key]) {
          acc[key] = { old: existingTask[key], new: input[key] };
        }
        return acc;
      }, {});

      if (Object.keys(differences).length === 0) {
        await queryRunner.release();
        return existingTask; // No changes detected
      }
      await queryRunner.manager.update(Task, existingTask.id, input);
      const updatedTask = await queryRunner.manager.findOne(Task, {
        where: { id: existingTask.id },
      });

      const taskHistory = this.taskHistoryRepository.create({
        task: updatedTask,
        updatedBy: currentUser.id,
        ...Object.keys(differences).reduce((acc, key) => {
          acc[`previous${key.charAt(0).toUpperCase() + key.slice(1)}`] =
            differences[key].old;
          acc[`new${key.charAt(0).toUpperCase() + key.slice(1)}`] =
            differences[key].new;
          return acc;
        }, {}),
      });

      await queryRunner.manager.save(taskHistory);
      await queryRunner.commitTransaction();
      return updatedTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Task with id ${id} not found`);
    }
    return true;
  }
}
