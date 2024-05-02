import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesResolver } from './workspaces.resolver';
import { User } from '../users/entities/user.entity';
import { UserWorkspacesModule } from '../user-workspaces/user-workspaces.module';

@Module({
  imports: [UserWorkspacesModule, TypeOrmModule.forFeature([Workspace, User])],
  providers: [WorkspacesService, WorkspacesResolver],
})
export class WorkspacesModule {}
