import { Injectable } from '@nestjs/common';
import { CreatePermissionGroupInput } from './dto/create-permission-group.input';
import { UpdatePermissionGroupInput } from './dto/update-permission-group.input';

@Injectable()
export class PermissionGroupsService {
  create(createPermissionGroupInput: CreatePermissionGroupInput) {
    return 'This action adds a new permissionGroup';
  }

  findAll() {
    return `This action returns all permissionGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissionGroup`;
  }

  update(id: number, updatePermissionGroupInput: UpdatePermissionGroupInput) {
    return `This action updates a #${id} permissionGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissionGroup`;
  }
}
