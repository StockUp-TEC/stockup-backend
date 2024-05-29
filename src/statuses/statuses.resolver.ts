import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StatusesService } from './statuses.service';
import { Status } from './entities/status.entity';

@Resolver(() => Status)
export class StatusesResolver {
  constructor(private readonly statusesService: StatusesService) {}

  @Query(() => [Status], { name: 'statuses' })
  findAll(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.statusesService.findAllForProject(projectId);
  }

  @Query(() => Status, { name: 'status' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.statusesService.findOne(id);
  }

  @Mutation(() => Status)
  removeStatus(@Args('id', { type: () => Int }) id: number) {
    return this.statusesService.remove(id);
  }
}
