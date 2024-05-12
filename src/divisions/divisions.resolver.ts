import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DivisionsService } from './divisions.service';
import { Division } from './entities/division.entity';
import { CreateDivisionInput } from './dto/create-division.input';
import { UpdateDivisionInput } from './dto/update-division.input';

@Resolver(() => Division)
export class DivisionsResolver {
  constructor(private readonly divisionsService: DivisionsService) {}

  // @Mutation(() => Division)
  // createDivision(
  //   @Args('createDivisionInput') createDivisionInput: CreateDivisionInput,
  // ) {
  //   return this.divisionsService.create(createDivisionInput);
  // }

  @Query(() => [Division], { name: 'divisions' })
  findAll() {
    return this.divisionsService.findAll();
  }

  @Query(() => Division, { name: 'division' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.divisionsService.findOne(id);
  }

  @Mutation(() => Boolean)
  updateDivision(
    @Args('updateDivisionInput') updateDivisionInput: UpdateDivisionInput,
  ) {
    return this.divisionsService.update(updateDivisionInput);
  }

  @Mutation(() => Boolean)
  removeDivision(@Args('id', { type: () => Int }) id: number) {
    return this.divisionsService.remove(id);
  }

  @Mutation(() => Division)
  addDivisionToWorkspace(
    @Args('divisionData') divisionData: CreateDivisionInput,
  ) {
    return this.divisionsService.addDivisionToWorkspace(divisionData);
  }
}
