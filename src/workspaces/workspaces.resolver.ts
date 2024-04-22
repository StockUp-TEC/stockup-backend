import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
  ) {
    return this.workspacesService.create(createWorkspaceInput);
  }
  @Query(() => [Workspace], { name: 'workspaces' })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Query(() => Workspace, { name: 'workspace' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.findOne(id);
  }

  @Mutation(() => Workspace)
  updateWorkspace(
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
  ) {
    return this.workspacesService.update(
      updateWorkspaceInput.id,
      updateWorkspaceInput,
    );
  }

  @Mutation(() => Workspace)
  removeWorkspace(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.remove(id);
  }

  @Mutation(() => Boolean)
  async addCompaniesToWorkspace(
    @Args('workspaceId', { type: () => Int }) id: number,
    @Args('companyIds', { type: () => [Int] }) companyIds: number[],
  ) {
    return this.workspacesService.addCompaniesToWorkspace(id, companyIds);
  }
}
