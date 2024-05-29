import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { Status } from './entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    private readonly projectsService: ProjectsService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}

  create(createStatusInput: CreateStatusInput) {
    return 'This action adds a new status';
  }

  async findAllForProject(projectId: number) {
    const project = await this.projectsService.findOne(projectId);
    const workspaceId = project.division.workspaceId;
    const statuses = await this.statusRepository.find({
      where: { workspaceId },
    });
    console.log(statuses);
    const tasks = await this.tasksService.findAllForProject(projectId);
    return statuses.map((status) => ({
      ...status,
      tasks: tasks.filter((task) => task.statusId === status.id),
    }));
  }

  async findOne(id: number) {
    const status = await this.statusRepository.findOne({
      where: { id },
      relations: {
        tasks: true,
      },
    });
    if (!status) {
      throw new Error('Status not found');
    }
    return status;
  }

  remove(id: number) {
    return this.statusRepository.delete(id);
  }
}
