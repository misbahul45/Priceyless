import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET / should return wrapped hello world response', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);

    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Request successful');
    expect(res.body.data).toBe('Hello World!');
  });
});
