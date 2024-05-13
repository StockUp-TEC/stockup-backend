import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StatusesService } from './statuses.service';
import { Status } from './entities/status.entity';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';

@Resolver(() => Status)
export class StatusesResolver {
  constructor(private readonly statusesService: StatusesService) {}

  @Mutation(() => Status)
  createStatus(@Args('createStatusInput') createStatusInput: CreateStatusInput) {
    return this.statusesService.create(createStatusInput);
  }

  @Query(() => [Status], { name: 'statuses' })
  findAll() {
    return this.statusesService.findAll();
  }

  @Query(() => Status, { name: 'status' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.statusesService.findOne(id);
  }

  @Mutation(() => Status)
  updateStatus(@Args('updateStatusInput') updateStatusInput: UpdateStatusInput) {
    return this.statusesService.update(updateStatusInput.id, updateStatusInput);
  }

  @Mutation(() => Status)
  removeStatus(@Args('id', { type: () => Int }) id: number) {
    return this.statusesService.remove(id);
  }
}
