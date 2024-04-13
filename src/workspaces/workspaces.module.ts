import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesResolver } from './workspaces.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  providers: [WorkspacesService, WorkspacesResolver],
})
export class WorkspacesModule {}
