import { Module } from '@nestjs/common';
import { UserWorkspacesService } from './user-workspaces.service';
import { UserWorkspacesResolver } from './user-workspaces.resolver';
import { UserWorkspace } from './entities/user-workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserWorkspace, User, Workspace, Role])],
  providers: [UserWorkspacesResolver, UserWorkspacesService],
  exports: [UserWorkspacesService],
})
export class UserWorkspacesModule {}
