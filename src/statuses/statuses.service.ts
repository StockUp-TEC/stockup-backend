import { Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { Status } from './entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { UpdateStatusInput } from './dto/update-status.input';
import { Task } from '../tasks/entities/task.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  async create(createStatusDto: CreateStatusInput) {
    const { name, color, projectId, nextStatusId } = createStatusDto;
    const status = this.statusRepository.create({ name, color, projectId });
    let previousLastStatus = null;

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
    } else {
      // Find the last status
      const lastStatus = await this.statusRepository.findOne({
        where: { nextStatus: IsNull() },
      });

      if (lastStatus) {
        previousLastStatus = lastStatus;
      }
    }

    const newStatus = await this.statusRepository.save(status);
    if (previousLastStatus) {
      await this.statusRepository.update(previousLastStatus.id, {
        nextStatusId: newStatus.id,
      });
    }
    return newStatus;
  }

  async createBaseStatuses(projectId: number) {
    // Transaction to ensure all statuses are created or none
    return await this.statusRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const statuses = [
          { name: 'To Do', color: '#FF0000' },
          { name: 'In Progress', color: '#00FF00' },
          { name: 'Done', color: '#0000FF' },
        ];

        let previousStatus: Status = null;
        for (const status of statuses) {
          const newStatus = entityManager.create(Status, {
            ...status,
            projectId,
          });
          if (previousStatus) {
            newStatus.nextStatus = previousStatus;
          }
          previousStatus = newStatus;
          await entityManager.save(newStatus);
        }
        return true;
      },
    );
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
    updateStatusId: number,
    updateStatusInput: UpdateStatusInput,
  ): Promise<boolean> {
    return this.statusRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const status = await entityManager.findOne(Status, {
          where: { id: updateStatusId },
        });

        if (!status) {
          throw new Error(`Status with ID ${updateStatusId} not found`);
        }

        const { name, color, nextStatusId } = updateStatusInput;
        if (name) status.name = name;
        if (color) status.color = color;

        if (
          nextStatusId !== undefined &&
          nextStatusId !== status.nextStatusId
        ) {
          if (nextStatusId === status.id) {
            throw new Error('Status cannot be its own next status');
          }

          const previousPreviousStatus = await entityManager.findOne(Status, {
            where: { nextStatusId: status.id },
          });
          if (previousPreviousStatus) {
            previousPreviousStatus.nextStatusId = status.nextStatusId;
            await entityManager.update(Status, previousPreviousStatus.id, {
              nextStatusId: status.nextStatusId,
            });
          }

          const previousStatusPointingToNextStatus =
            await entityManager.findOne(Status, {
              where: { nextStatusId: nextStatusId },
            });
          if (previousStatusPointingToNextStatus) {
            previousStatusPointingToNextStatus.nextStatusId = status.id;
            await entityManager.update(
              Status,
              previousStatusPointingToNextStatus.id,
              {
                nextStatusId: status.id,
              },
            );
          }

          if (nextStatusId === null) {
            status.nextStatusId = null;
            const previousLastStatus = await entityManager.findOne(Status, {
              where: { nextStatusId: IsNull() },
            });
            if (previousLastStatus) {
              previousLastStatus.nextStatusId = status.id;
              await entityManager.update(Status, previousLastStatus.id, {
                nextStatusId: status.id,
              });
            }
          }
        }

        await entityManager.update(Status, status.id, {
          name: status.name,
          color: status.color,
          nextStatusId: nextStatusId,
        });
        return true;
      },
    );
  }

  async remove(id: number) {
    const status = await this.statusRepository.findOne({
      where: { id },
      relations: {
        project: true,
      },
    });
    if (!status) {
      throw new Error('Status not found');
    }
    const projectStatuses = status.project.statuses;
    if (projectStatuses.length === 1) {
      throw new Error('Cannot delete the only status in the project');
    }

    // Transaction to ensure all statuses are updated or none
    return this.statusRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const previousStatus = await entityManager.findOne(Status, {
          where: { nextStatusId: id },
        });
        if (previousStatus) {
          previousStatus.nextStatusId = status.nextStatusId;
          await entityManager.update(Status, previousStatus.id, {
            nextStatusId: status.nextStatusId,
          });
        }

        const tasks = await entityManager.find(Task, {
          where: { statusId: id },
        });

        for (const task of tasks) {
          task.statusId = previousStatus
            ? previousStatus.id
            : status.nextStatusId;
        }
        await entityManager.update(
          Task,
          tasks.map((t) => t.id),
          {
            statusId: previousStatus ? previousStatus.id : status.nextStatusId,
          },
        );

        await entityManager.delete(Status, id);
        return true;
      },
    );
  }

  async getIndex(id: number) {
    const status = await this.statusRepository.findOne({
      where: { id },
      relations: {
        project: true,
      },
    });
    if (!status) {
      throw new Error('Status not found');
    }

    const statuses = await this.statusRepository.find({
      where: { projectId: status.project.id },
      order: { id: 'ASC' },
    });

    return statuses.findIndex((s) => s.id === id);
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  integrityCheck() {
    console.log('Running status integrity check');
    return this.statusRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const statuses = await entityManager.find(Status, {
          relations: {
            nextStatus: true,
          },
        });

        for (const status of statuses) {
          if (status.nextStatusId) {
            const nextStatus = statuses.find(
              (s) => s.id === status.nextStatusId,
            );
            if (!nextStatus) {
              // Next status not found
              await entityManager.update(Status, status.id, {
                nextStatusId: null,
              });
              return;
            }
            if (nextStatus.nextStatusId === status.id) {
              // Circular reference detected
              throw new Error(
                'Circular reference detected in status with ID ' + status.id,
              );
            }
          }
        }
      },
    );
  }
}
