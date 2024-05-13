import { Test, TestingModule } from '@nestjs/testing';
import { StatusesResolver } from './statuses.resolver';
import { StatusesService } from './statuses.service';

describe('StatusesResolver', () => {
  let resolver: StatusesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusesResolver, StatusesService],
    }).compile();

    resolver = module.get<StatusesResolver>(StatusesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
