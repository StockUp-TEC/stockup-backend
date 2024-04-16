import { Injectable } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  create(createPermissionInput: CreatePermissionInput) {
    return 'This action adds a new permission';
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionInput: UpdatePermissionInput) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }

  async findPermissionsWithIds(permissionIds: number[]) {
    const rolePermissions = [];
    for (const permissionId of permissionIds) {
      const permission = await this.permissionRepository.findOneBy({
        id: permissionId,
      });
      if (!permission) {
        throw new Error('Permission not found');
      }

      rolePermissions.push(permission);
    }

    return rolePermissions;
  }
}
