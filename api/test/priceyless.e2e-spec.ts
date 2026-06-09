import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('Priceyless API (e2e)', () => {
  let app: INestApplication;
  let prisma: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    prisma = app.get<DatabaseService>(DatabaseService);
    
    // Clean database (Be careful: this deletes everything)
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  let adminToken: string;
  let categoryId: string;
  let productId: string;

  describe('Auth', () => {
    it('/v1/auth/register (POST) - Success', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.email).toBe('admin@example.com');
          expect(res.body.password).toBeUndefined();
        });
    });

    it('/v1/auth/login (POST) - Success', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      adminToken = res.body.accessToken;

      // Manually set role to ADMIN for testing protected routes
      await prisma.user.update({
        where: { email: 'admin@example.com' },
        data: { role: 'ADMIN' },
      });
    });
  });

  describe('Categories', () => {
    it('/v1/categories (POST) - Success', () => {
      return request(app.getHttpServer())
        .post('/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Electronics',
          description: 'Gadgets and stuff',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.name).toBe('Electronics');
          categoryId = res.body.id;
        });
    });

    it('/v1/categories (GET) - Success', () => {
      return request(app.getHttpServer())
        .get('/v1/categories')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Products', () => {
    it('/v1/products (POST) - Success', () => {
      return request(app.getHttpServer())
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Smartphone',
          description: 'Latest model',
          price: 999.99,
          stock: 10,
          categoryId: categoryId,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.name).toBe('Smartphone');
          productId = res.body.id;
        });
    });

    it('/v1/products (GET) - Success', () => {
      return request(app.getHttpServer())
        .get('/v1/products')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].name).toBe('Smartphone');
        });
    });

    it('/v1/products/:id (PATCH) - Success', () => {
      return request(app.getHttpServer())
        .patch(`/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 899.99,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.price).toBe(899.99);
        });
    });

    it('/v1/products/:id (DELETE) - Success', () => {
      return request(app.getHttpServer())
        .delete(`/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
