import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import helmet from 'helmet';
import { AppModule } from '../../src/app.module';
import { env } from '../../src/config/env';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../../src/common/filters/prisma-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { RequestLoggingInterceptor } from '../../src/common/interceptors/request-logging.interceptor';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

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

  await app.init();

  return app;
}