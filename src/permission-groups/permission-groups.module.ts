import { Module } from '@nestjs/common';
import { PermissionGroupsService } from './permission-groups.service';
import { PermissionGroupsResolver } from './permission-groups.resolver';

@Module({
  providers: [PermissionGroupsResolver, PermissionGroupsService],
})
export class PermissionGroupsModule {}
