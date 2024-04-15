import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserWorkspaceInput } from './dto/create-user-workspace.input';
import { UpdateUserWorkspaceInput } from './dto/update-user-workspace.input';
import { UserWorkspace } from './entities/user-workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserWorkspacesService {
  constructor(
    @InjectRepository(UserWorkspace)
    private userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async validateUserAndWorkspace(userId: number, workspaceId: number) {
    const userExists = await this.userRepository.findOneBy({ id: userId });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const divisionExists = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    if (!divisionExists) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found.`,
      );
    }
  }

  async addUserToWorkspace(input: CreateUserWorkspaceInput) {
    await this.validateUserAndWorkspace(input.userId, input.workspaceId);
    const userWorkspace = await this.userWorkspaceRepository.findOne({
      where: { userId: input.userId, workspaceId: input.workspaceId },
    });

    if (userWorkspace) {
      throw new Error('User is already assigned to this workspace');
    }

    const newUserWorkspace = this.userWorkspaceRepository.create({
      userId: input.userId,
      workspaceId: input.workspaceId,
      roleId: input.roleId,
    });

    return this.userWorkspaceRepository.save(newUserWorkspace);
  }

  async updateUserWorkspaceRole(input: UpdateUserWorkspaceInput) {
    await this.validateUserAndWorkspace(input.userId, input.workspaceId);
    const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
      where: {
        userId: input.userId,
        workspaceId: input.workspaceId,
      },
    });

    userWorkspace.roleId = input.roleId;
    return this.userWorkspaceRepository.save(userWorkspace);
  }

  async removeUserFromWorkspace(userId: number, workspaceId: number) {
    await this.validateUserAndWorkspace(userId, workspaceId);
    const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
      where: {
        userId,
        workspaceId,
      },
    });

    return this.userWorkspaceRepository.remove(userWorkspace);
  }
}
