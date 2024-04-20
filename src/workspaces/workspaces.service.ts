import { Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}
  create(createWorkspaceDto: CreateWorkspaceInput) {
    return this.workspaceRepository.save(createWorkspaceDto);
  }

  async findAll() {
    return this.workspaceRepository.find();
  }

  async findOne(id: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    workspace.users = workspace.users.map((user) => {
      user.userWorkspaces = user.userWorkspaces.filter(
        (userWorkspace) => userWorkspace.workspaceId === id,
      );
      return user;
    });
    return workspace;
  }

  update(id: number, updateWorkspaceInput: UpdateWorkspaceInput) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return this.workspaceRepository.delete(id);
  }

  addUsers(id: number, userIds: number[]) {
    return this.workspaceRepository
      .createQueryBuilder()
      .relation(Workspace, 'users')
      .of(id)
      .add(userIds);
  }

  async addCompaniesToWorkspace(id: number, companyIds: number[]) {
    await this.workspaceRepository
      .createQueryBuilder()
      .relation(Workspace, 'companies')
      .of(id)
      .add(companyIds);
    return true;
  }
}
