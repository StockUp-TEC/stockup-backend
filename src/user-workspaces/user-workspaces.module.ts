import { Module } from '@nestjs/common';
import { UserWorkspacesService } from './user-workspaces.service';
import { UserWorkspacesResolver } from './user-workspaces.resolver';
import { UserWorkspace } from './entities/user-workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWorkspace]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Workspace]),
  ],
  providers: [UserWorkspacesResolver, UserWorkspacesService],
})
export class UserWorkspacesModule {}
