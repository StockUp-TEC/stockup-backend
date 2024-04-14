import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PermissionTypesService } from './permission-types.service';
import { PermissionType } from './entities/permission-type.entity';
import { CreatePermissionTypeInput } from './dto/create-permission-type.input';
import { UpdatePermissionTypeInput } from './dto/update-permission-type.input';

@Resolver(() => PermissionType)
export class PermissionTypesResolver {
  constructor(private readonly permissionTypesService: PermissionTypesService) {}

  @Mutation(() => PermissionType)
  createPermissionType(@Args('createPermissionTypeInput') createPermissionTypeInput: CreatePermissionTypeInput) {
    return this.permissionTypesService.create(createPermissionTypeInput);
  }

  @Query(() => [PermissionType], { name: 'permissionTypes' })
  findAll() {
    return this.permissionTypesService.findAll();
  }

  @Query(() => PermissionType, { name: 'permissionType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.permissionTypesService.findOne(id);
  }

  @Mutation(() => PermissionType)
  updatePermissionType(@Args('updatePermissionTypeInput') updatePermissionTypeInput: UpdatePermissionTypeInput) {
    return this.permissionTypesService.update(updatePermissionTypeInput.id, updatePermissionTypeInput);
  }

  @Mutation(() => PermissionType)
  removePermissionType(@Args('id', { type: () => Int }) id: number) {
    return this.permissionTypesService.remove(id);
  }
}
