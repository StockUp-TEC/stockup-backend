import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { UpdateTaskInput } from './dto/update-task.input';
import { CreateTaskInput } from './dto/create-task.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskHistory)
    private taskHistoryRepository: Repository<TaskHistory>,
    private readonly userService: UsersService,
  ) {}

  create(createTaskInput: CreateTaskInput) {
    return this.taskRepository.save(createTaskInput);
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async update(authId: string, updateTaskInput: UpdateTaskInput) {
    const queryRunner =
      this.taskRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const currentUser = await this.userService.me(authId);
      const existingTask = await queryRunner.manager.findOne(Task, {
        where: { id: updateTaskInput.id },
      });
      if (!existingTask) {
        throw new Error(`Task with id ${updateTaskInput.id} not found`);
      }

      const differences = Object.keys(updateTaskInput).reduce((acc, key) => {
        if (existingTask[key] !== updateTaskInput[key]) {
          acc[key] = { old: existingTask[key], new: updateTaskInput[key] };
        }
        return acc;
      }, {});

      if (Object.keys(differences).length === 0) {
        await queryRunner.release();
        return existingTask; // No changes detected
      }

      await queryRunner.manager.update(Task, existingTask.id, updateTaskInput);
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
    return result;
  }
}
