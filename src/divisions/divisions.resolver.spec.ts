import { Test, TestingModule } from '@nestjs/testing';
import { DivisionsResolver } from './divisions.resolver';
import { DivisionsService } from './divisions.service';

describe('DivisionsResolver', () => {
  let resolver: DivisionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivisionsResolver, DivisionsService],
    }).compile();

    resolver = module.get<DivisionsResolver>(DivisionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
