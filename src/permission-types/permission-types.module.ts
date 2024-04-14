import { Module } from '@nestjs/common';
import { PermissionTypesService } from './permission-types.service';
import { PermissionTypesResolver } from './permission-types.resolver';

@Module({
  providers: [PermissionTypesResolver, PermissionTypesService],
})
export class PermissionTypesModule {}
