import { Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWorkspacesService } from '../user-workspaces/user-workspaces.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userWorkspaceService: UserWorkspacesService,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceInput,
    authProviderId: string,
  ) {
    const wksp = await this.workspaceRepository.save(createWorkspaceDto);
    const user = await this.userRepository.findOne({
      where: { authProviderId },
    });

    await this.userWorkspaceService.addUsersToWorkspace({
      workspaceId: wksp.id,
      userData: [
        {
          userId: user.id,
          roleId: 1,
        },
      ],
    });
    return wksp;
  }

  async findAll() {
    return this.workspaceRepository.find();
  }

  async findOne(id: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['users.userWorkspaces'],
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  }

  update(id: number, updateWorkspaceInput: UpdateWorkspaceInput) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return this.workspaceRepository.delete(id);
  }
}
