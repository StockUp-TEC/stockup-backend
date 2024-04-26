import { NestFactory } from '@nestjs/core';
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
  // app.useGlobalGuards(new GqlAuthGuard());

  app.enableCors();

  await app.listen(3001);
}
bootstrap();
