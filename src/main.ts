import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GqlAuthGuard } from './auth/gql-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new GqlAuthGuard());

  app.enableCors();

  await app.listen(3001);
}
bootstrap();
