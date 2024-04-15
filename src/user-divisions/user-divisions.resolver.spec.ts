import { Test, TestingModule } from '@nestjs/testing';
import { UserDivisionsResolver } from './user-divisions.resolver';
import { UserDivisionsService } from './user-divisions.service';

describe('UserDivisionResolver', () => {
  let resolver: UserDivisionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDivisionsResolver, UserDivisionsService],
    }).compile();

    resolver = module.get<UserDivisionsResolver>(UserDivisionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
