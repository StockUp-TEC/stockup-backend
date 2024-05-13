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
import { UserDivisionsModule } from './user-divisions/user-divisions.module';
import { UserWorkspacesModule } from './user-workspaces/user-workspaces.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { EvidencesModule } from './evidences/evidences.module';
import { TasksModule } from './tasks/tasks.module';
import { StatusesModule } from './statuses/statuses.module';

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
      synchronize: false,
    }),
    UsersModule,
    WorkspacesModule,
    DivisionsModule,
    CompaniesModule,
    MailersendModule,
    RolesModule,
    UserDivisionsModule,
    UserWorkspacesModule,
    AuthModule,
    ProjectsModule,
    EvidencesModule,
    TasksModule,
    StatusesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
