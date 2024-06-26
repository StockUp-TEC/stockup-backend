import {
  Args,
  Context,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { GraphQLResolveInfo } from 'graphql/type';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  createWorkspace(
    @Context() context,
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
  ) {
    const authId = context.req.user.sub;
    return this.workspacesService.create(createWorkspaceInput, authId);
  }

  @Query(() => [Workspace], { name: 'workspaces' })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Query(() => Workspace, { name: 'workspace' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.workspacesService.findOne(id, info);
  }

  @Mutation(() => Workspace)
  updateWorkspace(
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
  ) {
    return this.workspacesService.update(updateWorkspaceInput);
  }

  @Mutation(() => Boolean)
  removeWorkspace(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.remove(id);
  }
}
