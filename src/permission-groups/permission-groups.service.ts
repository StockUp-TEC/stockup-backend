import { Injectable } from '@nestjs/common';
import { CreatePermissionGroupInput } from './dto/create-permission-group.input';
import { PermissionGroup } from './entities/permission-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionGroupsService {
  constructor(
    @InjectRepository(PermissionGroup)
    private permissionGroupRepository: Repository<PermissionGroup>,
  ) {}

  create(createPermissionGroupInput: CreatePermissionGroupInput) {
    return this.permissionGroupRepository.save(createPermissionGroupInput);
  }

  findAll() {
    return this.permissionGroupRepository.find();
  }

  findOne(id: number) {
    return this.permissionGroupRepository.findOne({
      where: { id },
    });
  }

  remove(id: number) {
    return this.permissionGroupRepository.delete(id);
  }
}
