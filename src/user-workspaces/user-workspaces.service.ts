import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserWorkspaceInput } from './dto/create-user-workspace.input';
import { UserWorkspace } from './entities/user-workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { DeleteUserWorkspaceInput } from './dto/delete-user-workspace.input';

@Injectable()
export class UserWorkspacesService {
  constructor(
    @InjectRepository(UserWorkspace)
    private userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async validateUsersAndWorkspace(userIds: number[], workspaceId: number) {
    for (const userId of userIds) {
      const userExists = await this.userRepository.findOneBy({ id: userId });
      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }
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

  async addUsersToWorkspace(input: CreateUserWorkspaceInput) {
    await this.validateUsersAndWorkspace(
      input.userData.map((u) => u.userId),
      input.workspaceId,
    );

    const userWorkspaces = await this.getUserWorkspacesFrom(input);

    return this.userWorkspaceRepository.save(userWorkspaces);
  }

  private async getUserWorkspacesFrom(input: CreateUserWorkspaceInput) {
    const userWorkspaces: UserWorkspace[] = [];
    for (const user of input.userData) {
      const role = await this.roleRepository.findOneBy({ id: user.roleId });
      if (!role) {
        throw new NotFoundException(`Role with ID ${user.roleId} not found.`);
      }

      const newUserWorkspace = this.userWorkspaceRepository.create({
        userId: user.userId,
        workspaceId: input.workspaceId,
        roleId: user.roleId,
      });
      userWorkspaces.push(newUserWorkspace);
    }
    return userWorkspaces;
  }

  async setWorkspaceUsers(input: CreateUserWorkspaceInput) {
    await this.validateUsersAndWorkspace(
      input.userData.map((u) => u.userId),
      input.workspaceId,
    );

    const existingUserWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        workspaceId: input.workspaceId,
      },
    });

    const userWorkspaces = await this.getUserWorkspacesFrom(input);

    const oldUserWorkspaces = existingUserWorkspaces.filter(
      (existingUserWorkspace) =>
        !userWorkspaces.find(
          (newUserWorkspace) =>
            newUserWorkspace.userId === existingUserWorkspace.userId,
        ),
    );
    await this.userWorkspaceRepository.remove(oldUserWorkspaces);

    return this.userWorkspaceRepository.save(userWorkspaces);
  }

  async removeUsersFromWorkspace(input: DeleteUserWorkspaceInput) {
    await this.validateUsersAndWorkspace(input.userIds, input.workspaceId);

    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        workspaceId: input.workspaceId,
      },
    });

    const usersToRemove = userWorkspaces.filter((uw) =>
      input.userIds.includes(uw.userId),
    );

    await this.userWorkspaceRepository.remove(usersToRemove);
    return true;
  }

  async removeAllUsersFromWorkspace(workspaceId: number) {
    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        workspaceId,
      },
    });

    await this.userWorkspaceRepository.remove(userWorkspaces);
    return true;
  }
}
