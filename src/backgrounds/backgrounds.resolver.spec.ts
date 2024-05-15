import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundsResolver } from './backgrounds.resolver';

describe('BackgroundsResolver', () => {
  let resolver: BackgroundsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackgroundsResolver],
    }).compile();

    resolver = module.get<BackgroundsResolver>(BackgroundsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
