import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { DatabaseService } from '../src/database/database.service';
import { createTestApp } from './helpers/create-test-app';

describe('Priceyless API (e2e)', () => {
  let app: INestApplication;
  let prisma: DatabaseService;
  let userToken: string;
  let adminToken: string;
  let categoryId: string;
  let productId: string;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get<DatabaseService>(DatabaseService);

    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Root', () => {
    it('GET / should return wrapped hello world response', async () => {
      const res = await request(app.getHttpServer()).get('/').expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Request successful');
      expect(res.body.data).toBe('Hello World!');
    });
  });

  describe('Auth', () => {
    it('POST /v1/auth/register should register user', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          name: 'Normal User',
          email: 'user@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.data.email).toBe('user@example.com');
      expect(res.body.data.password).toBeUndefined();
    });

    it('POST /v1/auth/register duplicate should return 409', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          name: 'Normal User',
          email: 'user@example.com',
          password: 'password123',
        })
        .expect(409);

      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('POST /v1/auth/register invalid email should return 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          name: 'Invalid User',
          email: 'not-email',
          password: 'password123',
        })
        .expect(400);

      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe('BAD_REQUEST');
    });

    it('POST /v1/auth/login should login user', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe('user@example.com');
      userToken = res.body.data.accessToken;
    });

    it('POST /v1/auth/login wrong password should return 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrong-password',
        })
        .expect(401);

      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('GET /v1/auth/me without token should return 401', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/auth/me')
        .expect(401);

      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('GET /v1/auth/me with token should return current user', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.email).toBe('user@example.com');
      expect(res.body.data.password).toBeUndefined();
    });
  });

  describe('Admin setup', () => {
    it('should create admin and login as admin', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      const res = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.role).toBe('ADMIN');
      adminToken = res.body.data.accessToken;
    });
  });

  describe('Categories', () => {
    it('POST /v1/categories without token should return 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/categories')
        .send({ name: 'Unauthorized Category' })
        .expect(401);

      expect(res.body.status).toBe('error');
    });

    it('POST /v1/categories as USER should return 403', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Forbidden Category' })
        .expect(403);

      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('POST /v1/categories as ADMIN should create category', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Electronics',
          description: 'Gadgets and devices',
        })
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Category created successfully');
      expect(res.body.data.name).toBe('Electronics');
      categoryId = res.body.data.id;
    });

    it('GET /v1/categories should list categories', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/categories')
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /v1/categories/:id should get category detail', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/categories/${categoryId}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.id).toBe(categoryId);
    });
  });

  describe('Products', () => {
    it('POST /v1/products without token should return 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/products')
        .send({
          name: 'Smartphone',
          price: 999,
          stock: 10,
          categoryId,
        })
        .expect(401);

      expect(res.body.status).toBe('error');
    });

    it('POST /v1/products as USER should return 403', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Smartphone',
          price: 999,
          stock: 10,
          categoryId,
        })
        .expect(403);

      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('POST /v1/products invalid category should return 404', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Smartphone',
          price: 999,
          stock: 10,
          categoryId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);

      expect(res.body.status).toBe('error');
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('POST /v1/products as ADMIN should create product', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Smartphone',
          description: 'Latest model',
          price: 999.99,
          stock: 10,
          categoryId,
        })
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Product created successfully');
      expect(res.body.data.name).toBe('Smartphone');
      productId = res.body.data.id;
    });

    it('GET /v1/products should list products', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/products')
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].name).toBe('Smartphone');
    });

    it('GET /v1/products/:id should get product detail', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/products/${productId}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.id).toBe(productId);
    });

    it('PATCH /v1/products/:id as ADMIN should update product', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 899.99,
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Product updated successfully');
      expect(res.body.data.price).toBe(899.99);
    });

    it('DELETE /v1/products/:id as ADMIN should delete product', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Product deleted successfully');
      expect(res.body.data).toBeNull();
    });
  });
});
