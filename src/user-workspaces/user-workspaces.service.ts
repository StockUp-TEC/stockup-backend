import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserWorkspaceInput } from './dto/create-user-workspace.input';
import { UserWorkspace } from './entities/user-workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

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

  // async addUserToWorkspace(input: CreateUserWorkspaceInput) {
  //   await this.validateUsersAndWorkspace(input.userId, input.workspaceId);
  //   const userWorkspace = await this.userWorkspaceRepository.findOne({
  //     where: { userId: input.userId, workspaceId: input.workspaceId },
  //   });
  //
  //   if (userWorkspace) {
  //     throw new Error('User is already assigned to this workspace');
  //   }
  //
  //   const newUserWorkspace = this.userWorkspaceRepository.create({
  //     userId: input.userId,
  //     workspaceId: input.workspaceId,
  //     roleId: input.roleId,
  //   });
  //
  //   return this.userWorkspaceRepository.save(newUserWorkspace);
  // }

  async assignUsersToWorkspace(input: CreateUserWorkspaceInput) {
    await this.validateUsersAndWorkspace(
      input.userData.map((u) => u.userId),
      input.workspaceId,
    );

    const existingUserWorkspaces = await this.userWorkspaceRepository.find({
      where: {
        workspaceId: input.workspaceId,
      },
    });

    const userWorkspaces: UserWorkspace[] = [];
    for (const user of input.userData) {
      // Check if role belongs to workspace
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

  // async updateUserWorkspaceRole(input: UpdateUserWorkspaceInput) {
  //   await this.validateUserAndWorkspace(input.userId, input.workspaceId);
  //   const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
  //     where: {
  //       userId: input.userId,
  //       workspaceId: input.workspaceId,
  //     },
  //   });
  //
  //   userWorkspace.roleId = input.roleId;
  //   return this.userWorkspaceRepository.save(userWorkspace);
  // }
  //
  // async removeUserFromWorkspace(userId: number, workspaceId: number) {
  //   await this.validateUserAndWorkspace(userId, workspaceId);
  //   const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
  //     where: {
  //       userId,
  //       workspaceId,
  //     },
  //   });
  //
  //   return this.userWorkspaceRepository.remove(userWorkspace);
  // }
}
