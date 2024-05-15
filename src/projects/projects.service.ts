import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDivisionsService } from '../user-divisions/user-divisions.service';
import { UsersService } from '../users/users.service';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectHistory } from './entities/project-history.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectHistory)
    private projectHistoryRepository: Repository<ProjectHistory>,
    private readonly userDivisionService: UserDivisionsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createProjectInput: CreateProjectInput, authId: string) {
    const user = await this.usersService.me(authId);

    const { divisionId, backgroundId } = createProjectInput;

    await this.userDivisionService.validateUserBelongsToDivision(
      user.id,
      divisionId,
    );

    const project = this.projectRepository.create(createProjectInput);
    project.users = [user];

    // Verify that the background exists
    return this.projectRepository.save(project);
  }

  async setProjectUsers(projectId: number, userIds: number[]) {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    const users = await this.usersService.findByIds(userIds);
    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more users not found.');
    }

    project.users = users;
    return this.projectRepository.save(project);
  }

  async update(updateProjectInput: UpdateProjectInput, authId: string) {
    const user = await this.usersService.me(authId);

    const { id, ...updateInput } = updateProjectInput;
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    // Check is dueDate changed
    if (updateInput.dueDate !== project.dueDate) {
      // Check if the dueDate is in the future
      if (updateInput.dueDate < new Date()) {
        throw new Error('Due date must be in the future.');
      }

      // Add to the project's history

      const newChange = this.projectHistoryRepository.create({
        newDueDate: updateInput.dueDate,
        previousDueDate: project.dueDate,
        reason: 'REASON FOR CHANGE',
        updatedBy: user.id,
      });

      project.history.push(newChange);
    }

    return this.projectRepository.save({ ...project, ...updateInput });
  }

  remove(id: number) {
    return this.projectRepository.delete(id);
  }
}
