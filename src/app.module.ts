import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { AuthService } from './services/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'oracle',
      username: 'STOCKUP',
      password: 'hfCkueBr9Yh7Jtt',
      connectString: 'stockup_high',
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: true,
    }),
    CompaniesModule,
    WorkspacesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes('*');
  }
}
