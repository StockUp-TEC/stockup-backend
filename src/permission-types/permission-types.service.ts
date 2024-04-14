import { Injectable } from '@nestjs/common';
import { CreatePermissionTypeInput } from './dto/create-permission-type.input';
import { UpdatePermissionTypeInput } from './dto/update-permission-type.input';

@Injectable()
export class PermissionTypesService {
  create(createPermissionTypeInput: CreatePermissionTypeInput) {
    return 'This action adds a new permissionType';
  }

  findAll() {
    return `This action returns all permissionTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissionType`;
  }

  update(id: number, updatePermissionTypeInput: UpdatePermissionTypeInput) {
    return `This action updates a #${id} permissionType`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissionType`;
  }
}
