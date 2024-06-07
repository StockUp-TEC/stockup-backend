import { Query, Resolver } from '@nestjs/graphql';
import { PriorityLevel } from './entities/priority-level.entity';
import { PriorityLevelsService } from './priority-levels.service';

@Resolver(() => PriorityLevel)
export class PriorityLevelsResolver {
  constructor(private readonly priorityLevelsService: PriorityLevelsService) {}

  @Query(() => [PriorityLevel], { name: 'priorityLevels' })
  findAll() {
    return this.priorityLevelsService.findAll();
  }
}
