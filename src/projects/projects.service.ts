import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDivisionsService } from '../user-divisions/user-divisions.service';
import { UsersService } from '../users/users.service';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectHistory } from './entities/project-history.entity';
import { BackgroundsService } from '../backgrounds/backgrounds.service';
import { StatusesService } from '../statuses/statuses.service';
import { Task } from '../tasks/entities/task.entity';
import { Division } from '../divisions/entities/division.entity';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectHistory)
    private projectHistoryRepository: Repository<ProjectHistory>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
    private readonly userDivisionService: UserDivisionsService,
    private readonly usersService: UsersService,
    private readonly backgroundsService: BackgroundsService,
    private readonly statusesService: StatusesService,
    private readonly tasksService: TasksService,
  ) {}

  async create(createProjectInput: CreateProjectInput, authId: string) {
    const user = await this.usersService.me(authId);

    const { divisionId, backgroundId, dueDate } = createProjectInput;

    if (new Date(dueDate).getTime() < new Date().getTime()) {
      throw new Error('Due date must be in the future.');
    }

    await this.userDivisionService.validateUserBelongsToDivision(
      user.id,
      divisionId,
    );

    await this.backgroundsService.findOne(backgroundId);

    const project = this.projectRepository.create(createProjectInput);
    project.users = [user];

    // Verify that the background exists
    await this.projectRepository.save(project);
    await this.statusesService.createBaseStatuses(project.id);
    return this.projectRepository.findOneBy({ id: project.id });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: {
        users: true,
        background: true,
        history: true,
        statuses: {
          tasks: {
            priority: true,
          },
        },
      },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    project.division = await this.divisionRepository.findOne({
      where: { id: project.divisionId },
    });
    project.tasks = project.tasks.filter((task) => !task.parentTaskId);
    return project;
  }

  async update(updateProjectInput: UpdateProjectInput, authId: string) {
    const user = await this.usersService.me(authId);

    const { id, userIds, backgroundId, ...updateInput } = updateProjectInput;
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    if (userIds) {
      const users = await this.usersService.findByIds(userIds);
      if (users.length !== userIds.length) {
        throw new NotFoundException('One or more users not found.');
      }

      project.users = users;
    }

    project.background = await this.backgroundsService.findOne(backgroundId);

    // Check is dueDate changed
    if (
      updateInput.dueDate &&
      new Date(updateInput.dueDate).getTime() !==
        new Date(project.dueDate).getTime()
    ) {
      if (!updateInput.reason || updateInput.reason === '') {
        throw new Error('Reason is required when changing the due date.');
      }

      // Add to the project's history

      const newChange = this.projectHistoryRepository.create({
        newDueDate: updateInput.dueDate,
        previousDueDate: project.dueDate,
        reason: updateInput.reason,
        updatedBy: user.id,
      });
      project.history.push(newChange);
    }

    await this.projectRepository.save({ ...project, ...updateInput });
    return this.projectRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.taskRepository.delete({ projectId: id });
    await this.statusesService.removeForProject(id);
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return true;
  }

  async removeUserFromProject(userId: number, projectId: number) {
    // Remove user from project tasks
    const projectTasks = await this.tasksService.findAllForProject(projectId);
    const userTasks = projectTasks.filter((task) => task.assignedId === userId);
    for (const task of userTasks) {
      await this.tasksService.unlinkUserFromTask(task.id);
    }
    // Remove user from project
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: {
        users: true,
      },
    });

    const updatedUsers = project.users.filter((user) => user.id !== userId);

    await this.projectRepository.update(projectId, {
      users: updatedUsers,
    });
  }
}
