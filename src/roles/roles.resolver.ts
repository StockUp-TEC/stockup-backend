import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { User } from '../users/entities/user.entity';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => Role)
  createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.rolesService.create(createRoleInput);
  }

  @Query(() => [Role], { name: 'roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Query(() => Role, { name: 'role' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.findOne(id);
  }

  @Mutation(() => Boolean)
  removeRole(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.remove(id);
  }

  @ResolveField(() => [User], { name: 'users' })
  async users(
    @Parent() role: Role,
    @Args('workspaceId', { type: () => Int, nullable: true })
    workspaceId?: number,
  ) {
    let userWorkspaces = role.userWorkspaces;
    if (workspaceId) {
      userWorkspaces = userWorkspaces.filter(
        (userWorkspace) => userWorkspace.workspaceId === workspaceId,
      );
    }
    const users = userWorkspaces.map((userWorkspace) => userWorkspace.user);

    return users;
  }
}
