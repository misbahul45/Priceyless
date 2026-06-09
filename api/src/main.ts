import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonConfig } from './common/logger/winston.config';
import helmet from 'helmet';
import { env } from './config/env';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
    bufferLogs: true,
  });

  app.use(helmet());

  app.enableCors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new RequestLoggingInterceptor(),
  );

  app.enableShutdownHooks();

  await app.listen(env.PORT);
}
bootstrap();

