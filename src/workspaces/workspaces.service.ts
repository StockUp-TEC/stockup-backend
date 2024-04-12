import { HttpException, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}
  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceRepository.save(createWorkspaceDto);
  }

  async findAll() {
    return this.workspaceRepository.find();
  }

  async findOne(id: number) {
    return this.workspaceRepository.findOneBy({ id: id });
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }

  async getDivisions(id: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: id },
      relations: ['divisions'],
    });

    if (!workspace) {
      throw new HttpException('Workspace not found', 404);
    }

    return workspace.divisions;
  }
}
