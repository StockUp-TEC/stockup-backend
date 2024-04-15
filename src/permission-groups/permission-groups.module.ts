import { Module } from '@nestjs/common';
import { PermissionGroupsService } from './permission-groups.service';
import { PermissionGroupsResolver } from './permission-groups.resolver';
import { PermissionGroup } from './entities/permission-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionGroup])],
  providers: [PermissionGroupsResolver, PermissionGroupsService],
})
export class PermissionGroupsModule {}
