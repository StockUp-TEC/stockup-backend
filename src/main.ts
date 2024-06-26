import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GqlAuthGuard } from './auth/gql-auth.guard';
import * as fs from 'fs';

async function bootstrap() {
  const key = fs.readFileSync('./certs/myserver.key');
  const cert = fs.readFileSync('./certs/stockup_ddns_net.pem');

  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key,
      cert,
    },
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new GqlAuthGuard(reflector));

  app.enableCors();

  await app.listen(3001);
}

bootstrap();
