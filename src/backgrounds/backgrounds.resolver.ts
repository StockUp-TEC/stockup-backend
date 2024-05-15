import { Query, Resolver } from '@nestjs/graphql';
import { Background } from './entities/background.entity';
import { BackgroundsService } from './backgrounds.service';

@Resolver(() => Background)
export class BackgroundsResolver {
  constructor(private readonly backgroundsService: BackgroundsService) {}

  @Query(() => [Background])
  backgrounds() {
    return this.backgroundsService.findAll();
  }
}
