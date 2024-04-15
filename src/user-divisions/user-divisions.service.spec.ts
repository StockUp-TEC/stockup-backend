import { Test, TestingModule } from '@nestjs/testing';
import { UserDivisionsService } from './user-divisions.service';

describe('UserDivisionService', () => {
  let service: UserDivisionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDivisionsService],
    }).compile();

    service = module.get<UserDivisionsService>(UserDivisionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
