import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CompaniesModule } from './companies/companies.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { UsersModule } from './users/users.module';
import { UsersDivisionsModule } from './users-divisions/users-divisions.module';
import { DivisionsModule } from './divisions/divisions.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('StockUp API')
    .setDescription('StockUp API for FSAE Tec Racing')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [
      CompaniesModule,
      WorkspacesModule,
      UsersModule,
      UsersDivisionsModule,
      DivisionsModule,
    ],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
