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

  @Query(() => Project)
  project(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.findOne(id);
  }

  @Mutation(() => Project)
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
    @Context() context,
  ) {
    const authId = context.req.user.sub;
    return this.projectsService.update(updateProjectInput, authId);
  }

  @Mutation(() => Project)
  removeProject(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.remove(id);
  }
}
