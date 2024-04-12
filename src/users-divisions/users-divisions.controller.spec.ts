import { Test, TestingModule } from '@nestjs/testing';
import { UsersDivisionsController } from './users-divisions.controller';

describe('UsersDivisionsController', () => {
  let controller: UsersDivisionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersDivisionsController],
    }).compile();

    controller = module.get<UsersDivisionsController>(UsersDivisionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
