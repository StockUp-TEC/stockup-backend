import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserWorkspacesService } from './user-workspaces.service';
import { UserWorkspace } from './entities/user-workspace.entity';
import { CreateUserWorkspaceInput } from './dto/create-user-workspace.input';
import { UpdateUserWorkspaceInput } from './dto/update-user-workspace.input';
import { DeleteUserWorkspaceInput } from './dto/delete-user-workspace.input';

@Resolver(() => UserWorkspace)
export class UserWorkspacesResolver {
  constructor(private readonly userWorkspacesService: UserWorkspacesService) {}

  // @Mutation(() => UserWorkspace)
  // addUserToWorkspace(
  //   @Args('createUserWorkspaceInput')
  //   createUserWorkspaceInput: CreateUserWorkspaceInput,
  // ) {
  //   return this.userWorkspacesService.addUserToWorkspace(
  //     createUserWorkspaceInput,
  //   );
  // }

  @Mutation(() => [UserWorkspace])
  addUsersToWorkspace(
    @Args('createUserWorkspaceInput')
    createUserWorkspaceInput: CreateUserWorkspaceInput,
  ) {
    return this.userWorkspacesService.addUsersToWorkspace(
      createUserWorkspaceInput,
    );
  }

  @Mutation(() => [UserWorkspace])
  setWorkspaceUsers(
    @Args('createUserWorkspaceInput')
    createUserWorkspaceInput: CreateUserWorkspaceInput,
  ) {
    return this.userWorkspacesService.setWorkspaceUsers(
      createUserWorkspaceInput,
    );
  }

  @Mutation(() => Boolean)
  removeUsersFromWorkspace(
    @Args('deleteUserWorkspaceInput')
    deleteUserWorkspaceInput: DeleteUserWorkspaceInput,
  ) {
    return this.userWorkspacesService.removeUsersFromWorkspace(
      deleteUserWorkspaceInput,
    );
  }
}
