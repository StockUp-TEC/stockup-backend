import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDivisionsService } from '../user-divisions/user-divisions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly userDivisionService: UserDivisionsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createProjectInput: CreateProjectInput, authId: string) {
    // Verify that the division exists

    const { divisionId, backgroundId, assignedId } = createProjectInput;

    await this.userDivisionService.validateUserBelongsToDivision(
      assignedId,
      divisionId,
    );

    const user = await this.usersService.me(authId);

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

  remove(id: number) {
    return this.projectRepository.delete(id);
  }
}
