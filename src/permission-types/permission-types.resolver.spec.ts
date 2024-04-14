import { Test, TestingModule } from '@nestjs/testing';
import { PermissionTypesResolver } from './permission-types.resolver';
import { PermissionTypesService } from './permission-types.service';

describe('PermissionTypesResolver', () => {
  let resolver: PermissionTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionTypesResolver, PermissionTypesService],
    }).compile();

    resolver = module.get<PermissionTypesResolver>(PermissionTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
