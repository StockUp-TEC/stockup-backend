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
import { UserDivision } from '../user-divisions/entities/user-division.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { FirebaseStorageModule } from '../firebase-storage/firebase-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Workspace,
      Role,
      UserWorkspace,
      Company,
      UserDivision,
      Project,
      Task,
    ]),
    MailersendModule,
    FirebaseStorageModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
