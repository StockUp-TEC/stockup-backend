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

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectHistory)
    private projectHistoryRepository: Repository<ProjectHistory>,
    private readonly userDivisionService: UserDivisionsService,
    private readonly usersService: UsersService,
    private readonly backgroundsService: BackgroundsService,
  ) {}

  async create(createProjectInput: CreateProjectInput, authId: string) {
    const user = await this.usersService.me(authId);

    const { divisionId, backgroundId } = createProjectInput;

    await this.userDivisionService.validateUserBelongsToDivision(
      user.id,
      divisionId,
    );

    await this.backgroundsService.findOne(backgroundId);

    const project = this.projectRepository.create(createProjectInput);
    project.users = [user];

    // Verify that the background exists
    return this.projectRepository.save(project);
  }

  findOne(id: number) {
    return this.projectRepository.findOneBy({ id });
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
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return result;
  }
}
