import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Role } from '../roles/entities/role.entity';
import { UserWorkspace } from '../user-workspaces/entities/user-workspace.entity';
import { Company } from '../companies/entities/company.entity';
import { MailersendModule } from '../mailersend/mailersend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Workspace, Role, UserWorkspace, Company]),
    MailersendModule,
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
