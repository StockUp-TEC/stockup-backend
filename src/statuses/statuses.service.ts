import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
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

  a;
  async findAllForProject(projectId: number): Promise<Status[]> {
    // Fetch project and workspaceId as before
    const project = await this.projectsService.findOne(projectId);
    const workspaceId = project.division.workspaceId;

    // Fetch all statuses for the workspace
    const statuses = await this.statusRepository.find({
      where: { workspaceId },
      relations: {
        nextStatus: true,
      },
    });

    // Fetch all tasks for the project
    const tasks = await this.tasksService.findAllForProject(projectId);

    // Assign tasks to statuses
    statuses.forEach((status) => {
      status.tasks = tasks.filter((task) => task.statusId === status.id);
    });

    // Create a map of status IDs to statuses
    const statusMap = new Map<number, Status>();
    statuses.forEach((status) => statusMap.set(status.id, status));

    // Find the starting point of the linked list
    let currentStatus = statuses.find(
      (status) =>
        !statuses.some((s) => s.nextStatus && s.nextStatus.id === status.id),
    );

    // Traverse the linked list and assign the index
    let index = 0;
    const orderedStatuses: Status[] = [];
    while (currentStatus) {
      currentStatus.index = index;
      orderedStatuses.push(currentStatus);
      currentStatus = currentStatus.nextStatus
        ? statusMap.get(currentStatus.nextStatus.id)
        : null;
      index++;
    }

    return orderedStatuses;
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
