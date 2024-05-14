import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
    @Context() context,
  ) {
    const authId = context.req.user.sub;
    return this.projectsService.create(createProjectInput, authId);
  }

  @Mutation(() => Project)
  setProjectUsers(
    @Args('projectId', { type: () => Int }) projectId: number,
    @Args('userIds', { type: () => [Int] }) userIds: number[],
  ) {
    return this.projectsService.setProjectUsers(projectId, userIds);
  }

  @Mutation(() => Project)
  removeProject(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.remove(id);
  }
}
