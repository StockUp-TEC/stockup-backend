import { Injectable } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDivisionsService } from '../user-divisions/user-divisions.service';
import { DivisionsService } from '../divisions/divisions.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly userDivisionService: UserDivisionsService,
  ) {}

  async create(createProjectInput: CreateProjectInput) {
    // Verify that the division exists

    const { divisionId, backgroundId, assignedId } = createProjectInput;

    await this.userDivisionService.validateUserBelongsToDivision(
      assignedId,
      divisionId,
    );

    // Verify that the background exists
    return this.projectRepository.save(createProjectInput);
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectInput: UpdateProjectInput) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
