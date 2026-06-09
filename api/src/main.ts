import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonConfig } from './common/logger/winston.config';
import { env } from './config/env';
import { setupApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
    bufferLogs: true,
  });

  setupApp(app);

  await app.listen(env.PORT);
}
bootstrap();
