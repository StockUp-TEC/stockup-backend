import { Test, TestingModule } from '@nestjs/testing';
import { PriorityLevelsService } from './priority-levels.service';

describe('PriorityLevelsService', () => {
  let service: PriorityLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriorityLevelsService],
    }).compile();

    service = module.get<PriorityLevelsService>(PriorityLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
