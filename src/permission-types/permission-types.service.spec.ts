import { Test, TestingModule } from '@nestjs/testing';
import { PermissionTypesService } from './permission-types.service';

describe('PermissionTypesService', () => {
  let service: PermissionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionTypesService],
    }).compile();

    service = module.get<PermissionTypesService>(PermissionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
