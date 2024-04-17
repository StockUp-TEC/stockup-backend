import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(createRoleInput: CreateRoleInput) {
    const permissions = await this.permissionsService.findPermissionsWithIds(
      createRoleInput.permissionIds,
    );
    const auth0RoleId = await this.addRoleToAuth0(createRoleInput, permissions);
    const role = this.roleRepository.create({
      ...createRoleInput,
      permissions: permissions,
      auth0RoleId: auth0RoleId,
    });
    return await this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOneBy({ id });
  }

  getRoleByWorkspaceId(workspaceId: number) {
    return this.roleRepository.find({ where: { workspaceId } });
  }

  async update(id: number, updateRoleInput: UpdateRoleInput) {
    const permissions = await this.permissionsService.findPermissionsWithIds(
      updateRoleInput.permissionIds,
    );
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error('Role not found');
    }

    await this.updateRoleInAuth0(
      role.auth0RoleId,
      updateRoleInput,
      role.permissions,
      permissions,
    );

    role.name = updateRoleInput.name;
    role.description = updateRoleInput.description;
    role.permissions = permissions;
    return await this.roleRepository.save(role);
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

  async addRoleToAuth0(
    createRoleInput: CreateRoleInput,
    permissions: Permission[],
  ) {
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
      const auth0Permissions = permissions.map((permission) => ({
        resource_server_identifier: process.env.AUTH0_AUDIENCE,
        permission_name: permission.name,
      }));
      const response = await axios.request(config);
      const roleId = response.data.id;
      await this.addPermissionsToAuth0Role(roleId, auth0Permissions);
      return roleId;
    } catch (e) {
      throw new Error(`Failed to add role to Auth0: ${e}`);
    }
  }

  async addPermissionsToAuth0Role(
    roleId: string,
    permissions: {
      resource_server_identifier: string;
      permission_name: string;
    }[],
  ) {
    const data = JSON.stringify({
      permissions: permissions,
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://dev-i75q7owwpb0zkbdl.us.auth0.com/api/v2/roles/${roleId}/permissions`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.AUTH0_MANAGEMENT_TOKEN,
      },
      data: data,
    };

    try {
      console.log(config);
      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw new Error('Failed to add permissions to Auth0 role' + e);
    }
  }

  async removePermissionsFromAuth0Role(
    roleId: string,
    permissions: {
      resource_server_identifier: string;
      permission_name: string;
    }[],
  ) {
    const data = JSON.stringify({
      permissions: permissions,
    });
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `https://dev-i75q7owwpb0zkbdl.us.auth0.com/api/v2/roles/${roleId}/permissions`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.AUTH0_MANAGEMENT_TOKEN,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw new Error('Failed to remove permissions from Auth0 role' + e);
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

  async updateRoleInAuth0(
    roleId: string,
    updateRoleInput: UpdateRoleInput,
    oldPermissions: Permission[],
    newPermissions: Permission[],
  ) {
    const data = JSON.stringify({
      name: updateRoleInput.name,
      description: updateRoleInput.description,
    });
    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'https://dev-i75q7owwpb0zkbdl.us.auth0.com/api/v2/roles/' + roleId,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + process.env.AUTH0_MANAGEMENT_TOKEN,
      },
      data: data,
    };

    try {
      const oldAuth0Permissions = oldPermissions.map((permission) => ({
        resource_server_identifier: process.env.AUTH0_AUDIENCE,
        permission_name: permission.name,
      }));
      const newAuth0Permissions = newPermissions.map((permission) => ({
        resource_server_identifier: process.env.AUTH0_AUDIENCE,
        permission_name: permission.name,
      }));
      await this.removePermissionsFromAuth0Role(roleId, oldAuth0Permissions);
      await this.addPermissionsToAuth0Role(roleId, newAuth0Permissions);
      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw new Error('Failed to update role in Auth0: ' + e);
    }
  }
}
