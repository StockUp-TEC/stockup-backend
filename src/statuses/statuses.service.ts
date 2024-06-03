import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { Status } from './entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { UpdateStatusInput } from './dto/update-status.input';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    private readonly projectsService: ProjectsService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}

  async create(createStatusDto: CreateStatusInput): Promise<Status> {
    const { name, color, workspaceId, nextStatusId } = createStatusDto;
    const status = this.statusRepository.create({ name, color, workspaceId });

    if (nextStatusId) {
      // Fetch the next status
      const nextStatus = await this.statusRepository.findOne({
        where: { id: nextStatusId },
        relations: {
          nextStatus: true,
        },
      });
      if (!nextStatus) {
        throw new Error('Next status not found');
      }

      // Insert the new status before the nextStatus
      status.nextStatus = nextStatus;

      // Find the previous status that should now point to the new status
      const previousStatus = await this.statusRepository.findOne({
        where: { nextStatus: nextStatus },
      });

      if (previousStatus) {
        previousStatus.nextStatus = status;
        await this.statusRepository.save(previousStatus);
      }
    }

    return await this.statusRepository.save(status);
  }

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

  async update(
    id: number,
    updateStatusDto: UpdateStatusInput,
  ): Promise<boolean> {
    return await this.statusRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const status = await entityManager.findOne(Status, {
          where: { id },
          relations: ['nextStatus'],
        });

        if (!status) {
          throw new Error(`Status with ID ${id} not found`);
        }

        const { name, color, nextStatusId } = updateStatusDto;
        if (name) status.name = name;
        if (color) status.color = color;

        const previousStatus = await entityManager.findOne(Status, {
          where: { nextStatus: status },
        });

        if (
          nextStatusId !== undefined &&
          nextStatusId !== status.nextStatus?.id
        ) {
          // Handle the unlinking of the current next status
          if (status.nextStatus) {
            if (previousStatus) {
              previousStatus.nextStatus = status.nextStatus;
              await entityManager.save(previousStatus);
            }
          }

          // Handle the new next status link
          if (nextStatusId === null) {
            const previousLastStatus = await entityManager.findOne(Status, {
              where: {
                workspaceId: status.workspaceId,
                nextStatus: IsNull(),
              },
            });

            if (previousLastStatus) {
              previousLastStatus.nextStatus = status;
              await entityManager.save(previousLastStatus);
            }

            status.nextStatus = null;
          } else {
            const newNextStatus = await entityManager.findOne(Status, {
              where: { id: nextStatusId },
            });

            if (!newNextStatus) {
              throw new Error(`Next status with ID ${nextStatusId} not found`);
            }

            status.nextStatus = newNextStatus;

            const previousStatusOfNewNextStatus = await entityManager.findOne(
              Status,
              {
                where: { nextStatus: newNextStatus },
              },
            );

            if (previousStatusOfNewNextStatus) {
              previousStatusOfNewNextStatus.nextStatus = status;
              await entityManager.save(previousStatusOfNewNextStatus);
            }
          }
        }

        await entityManager.save(status);

        return true;
      },
    );
  }

  remove(id: number) {
    return this.statusRepository.delete(id);
  }
}
