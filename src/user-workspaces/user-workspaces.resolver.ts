import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserWorkspacesService } from './user-workspaces.service';
import { UserWorkspace } from './entities/user-workspace.entity';
import { CreateUserWorkspaceInput } from './dto/create-user-workspace.input';
import { UpdateUserWorkspaceInput } from './dto/update-user-workspace.input';

@Resolver(() => UserWorkspace)
export class UserWorkspacesResolver {
  constructor(private readonly userWorkspacesService: UserWorkspacesService) {}

  @Mutation(() => UserWorkspace)
  addUserToWorkspace(
    @Args('createUserWorkspaceInput')
    createUserWorkspaceInput: CreateUserWorkspaceInput,
  ) {
    return this.userWorkspacesService.addUserToWorkspace(
      createUserWorkspaceInput,
    );
  }

  @Mutation(() => UserWorkspace)
  updateUserWorkspace(
    @Args('updateUserWorkspaceInput')
    updateUserWorkspaceInput: UpdateUserWorkspaceInput,
  ) {
    return this.userWorkspacesService.updateUserWorkspaceRole(
      updateUserWorkspaceInput,
    );
  }

  @Mutation(() => UserWorkspace)
  removeUserWorkspace(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('workspaceId', { type: () => Int }) workspaceId: number,
  ) {
    return this.userWorkspacesService.removeUserFromWorkspace(
      userId,
      workspaceId,
    );
  }
}
