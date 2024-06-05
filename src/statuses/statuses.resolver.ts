import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { StatusesService } from './statuses.service';
import { Status } from './entities/status.entity';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';

@Resolver(() => Status)
export class StatusesResolver {
  constructor(private readonly statusesService: StatusesService) {}

  @Mutation(() => Status)
  createStatus(
    @Args('createStatusInput') createStatusInput: CreateStatusInput,
  ) {
    return this.statusesService.create(createStatusInput);
  }

  @Mutation(() => Boolean)
  updateStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateStatusInput') updateStatusInput: UpdateStatusInput,
  ) {
    return this.statusesService.update(id, updateStatusInput);
  }

  @Query(() => Status, { name: 'status' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.statusesService.findOne(id);
  }

  @Mutation(() => Status)
  removeStatus(@Args('id', { type: () => Int }) id: number) {
    return this.statusesService.remove(id);
  }

  @ResolveField(() => Int, { name: 'index' })
  async index(@Parent() { id }: Status) {
    return this.statusesService.getIndex(id);
  }
}
