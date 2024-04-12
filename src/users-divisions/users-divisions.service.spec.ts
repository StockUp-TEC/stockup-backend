import { Test, TestingModule } from '@nestjs/testing';
import { UsersDivisionsService } from './users-divisions.service';

describe('UsersDivisionsService', () => {
  let service: UsersDivisionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersDivisionsService],
    }).compile();

    service = module.get<UsersDivisionsService>(UsersDivisionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
