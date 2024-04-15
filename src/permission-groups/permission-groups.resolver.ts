import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PermissionGroupsService } from './permission-groups.service';
import { PermissionGroup } from './entities/permission-group.entity';
import { CreatePermissionGroupInput } from './dto/create-permission-group.input';
import { UpdatePermissionGroupInput } from './dto/update-permission-group.input';

@Resolver(() => PermissionGroup)
export class PermissionGroupsResolver {
  constructor(
    private readonly permissionGroupsService: PermissionGroupsService,
  ) {}

  @Mutation(() => PermissionGroup)
  createPermissionGroup(
    @Args('createPermissionGroupInput')
    createPermissionGroupInput: CreatePermissionGroupInput,
  ) {
    return this.permissionGroupsService.create(createPermissionGroupInput);
  }

  @Query(() => [PermissionGroup], { name: 'permissionGroups' })
  findAll() {
    return this.permissionGroupsService.findAll();
  }

  @Query(() => PermissionGroup, { name: 'permissionGroup' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.permissionGroupsService.findOne(id);
  }

  @Mutation(() => PermissionGroup)
  removePermissionGroup(@Args('id', { type: () => Int }) id: number) {
    return this.permissionGroupsService.remove(id);
  }
}
