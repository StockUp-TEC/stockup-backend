import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DivisionsModule } from './divisions/divisions.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { CompaniesModule } from './companies/companies.module';
import { MailersendModule } from './mailersend/mailersend.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionGroupsModule } from './permission-groups/permission-groups.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TypeOrmModule.forRoot({
      type: 'oracle',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    UsersModule,
    WorkspacesModule,
    DivisionsModule,
    CompaniesModule,
    MailersendModule,
    RolesModule,
    PermissionsModule,
    PermissionGroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
