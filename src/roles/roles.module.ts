import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { AuthModule } from '../auth/auth.module';
import { UserWorkspace } from '../user-workspaces/entities/user-workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserWorkspace]), AuthModule],
  providers: [RolesResolver, RolesService],
})
export class RolesModule {}
