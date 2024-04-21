import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { UserWorkspace } from '../user-workspaces/entities/user-workspace.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserWorkspace)
    private userWorkspaceRepository: Repository<UserWorkspace>,
  ) {}

  async create(createRoleInput: CreateRoleInput) {
    const auth0RoleId = await this.addRoleToAuth0(createRoleInput);
    const role = this.roleRepository.create({
      ...createRoleInput,
      auth0RoleId: auth0RoleId,
    });
    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find({
      relations: {
        userWorkspaces: true,
      },
    });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
      relations: {
        userWorkspaces: true,
      },
    });
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      return false;
    }
    await this.removeRoleFromAuth0(role.auth0RoleId);
    await this.roleRepository.delete(id);
    return true;
  }

  /// Auth0

  async addRoleToAuth0(createRoleInput: CreateRoleInput) {
    const data = JSON.stringify({
      name: createRoleInput.name,
      description: createRoleInput.description,
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev-i75q7owwpb0zkbdl.us.auth0.com/api/v2/roles',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_TOKEN}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data.id;
    } catch (e) {
      throw new Error(`Failed to add role to Auth0: ${e}`);
    }
  }

  async removeRoleFromAuth0(roleId: string) {
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'https://dev-i75q7owwpb0zkbdl.us.auth0.com/api/v2/roles/' + roleId,
      headers: {
        Authorization: 'Bearer ' + process.env.AUTH0_MANAGEMENT_TOKEN,
      },
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw new Error('Failed to remove role from Auth0: ' + e);
    }
  }

  async findUsersByRole(roleId: number) {
    const userWorkspace = await this.userWorkspaceRepository.find({
      where: { roleId },
      relations: ['user'],
    });
    return userWorkspace.map((uw) => uw.user);
  }
}
