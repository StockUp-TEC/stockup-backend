import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupsResolver } from './permission-groups.resolver';
import { PermissionGroupsService } from './permission-groups.service';

describe('PermissionGroupsResolver', () => {
  let resolver: PermissionGroupsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionGroupsResolver, PermissionGroupsService],
    }).compile();

    resolver = module.get<PermissionGroupsResolver>(PermissionGroupsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
