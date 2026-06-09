import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, VerificationType } from '../generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run the seed script');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const users = [
  {
    id: '0e4389b5-689b-4da6-8fd6-4d98cc49d37f',
    name: 'Admin Priceyless',
    email: 'admin@priceyless.test',
    role: Role.ADMIN,
  },
  {
    id: '77c8c22f-3591-4a37-9218-72f17658dc07',
    name: 'User Priceyless',
    email: 'user@priceyless.test',
    role: Role.USER,
  },
];

const categories = [
  {
    id: '0119cd0d-2187-494d-a77d-f8ec11425583',
    name: 'Electronics',
    description: 'Phones, laptops, and smart devices.',
  },
  {
    id: '44f5ba84-8a42-4e13-ae50-b1b25c556da7',
    name: 'Home Appliances',
    description: 'Appliances for kitchen and home operations.',
  },
  {
    id: '4b095ae6-a802-4bbd-9dcb-06f5f3201b67',
    name: 'Office Supplies',
    description: 'Daily supplies for office productivity.',
  },
  {
    id: 'c4ce930f-28dc-47ee-8638-cdcdf55ecc7c',
    name: 'Fashion',
    description: 'Apparel and accessories.',
  },
  {
    id: 'a8d4d1c2-8ea9-48e4-a860-3865c71846b3',
    name: 'Groceries',
    description: 'Packaged food and daily grocery inventory.',
  },
];

const products = [
  ['0d30275e-72a5-44f9-8a21-e4e8f12ea6bc', 'Smartphone Pro X', 'Flagship smartphone with OLED display.', 999.99, 14, 'Electronics'],
  ['6f2f7a07-2fd8-497c-9626-83c3122e14de', 'Wireless Earbuds Air', 'Noise-cancelling wireless earbuds.', 149.99, 32, 'Electronics'],
  ['92430830-47f8-49f4-8e56-c2eb071ec631', 'Laptop Ultra 14', 'Lightweight laptop for work and travel.', 1299.0, 8, 'Electronics'],
  ['8d48f115-bcae-40c0-8d08-4f46df227391', 'Smart Watch Fit', 'Fitness smartwatch with health tracking.', 249.5, 19, 'Electronics'],
  ['e8bb750d-0f1b-41c3-b956-2d860f4936f4', 'Bluetooth Speaker Mini', 'Portable speaker with deep bass.', 79.0, 27, 'Electronics'],
  ['981a35fe-f8dc-4a12-8f50-8cf524bc50f5', 'Air Fryer 5L', 'Compact air fryer for daily cooking.', 119.99, 11, 'Home Appliances'],
  ['980e0dc7-e8ee-4120-89a2-b4b19881a94f', 'Rice Cooker Digital', 'Digital rice cooker with timer presets.', 89.99, 16, 'Home Appliances'],
  ['44aceff8-dad9-4672-9183-2f995a361d27', 'Vacuum Cleaner Cyclone', 'Bagless vacuum cleaner for home use.', 179.0, 7, 'Home Appliances'],
  ['83458ec5-bddc-498a-bc22-d998bb24c4e1', 'Electric Kettle 1.7L', 'Fast-boil stainless steel kettle.', 39.99, 25, 'Home Appliances'],
  ['9c609c71-6263-4d79-a90c-9b3823ab3ef8', 'Standing Desk Lamp', 'LED desk lamp with adjustable arm.', 59.99, 20, 'Office Supplies'],
  ['56801cba-6854-411a-8837-b9c93eb439f6', 'Notebook Pack A5', 'Pack of five ruled A5 notebooks.', 12.5, 80, 'Office Supplies'],
  ['e2670de1-8f31-4498-a4d0-22992985e0ad', 'Ergonomic Office Chair', 'Adjustable chair with lumbar support.', 219.0, 6, 'Office Supplies'],
  ['d950dd97-6a9a-40cb-895b-1d8758146f90', 'Mechanical Keyboard', 'Tactile keyboard for office workflows.', 95.0, 18, 'Office Supplies'],
  ['f99c7969-35bc-44a4-aac4-1d2d536ec621', 'Cotton Hoodie', 'Soft cotton hoodie for daily wear.', 49.99, 34, 'Fashion'],
  ['1a5c9334-ea8d-4d72-a90a-ef541c818a63', 'Canvas Sneakers', 'Low-top sneakers with rubber sole.', 69.0, 22, 'Fashion'],
  ['0add1bb9-85ff-40dc-a5d1-0e17e88107e6', 'Leather Wallet', 'Slim wallet with card slots.', 35.0, 41, 'Fashion'],
  ['b4147d80-e397-4243-a3e6-3c139839cc3e', 'Arabica Coffee Beans 1kg', 'Medium roast whole bean coffee.', 24.99, 45, 'Groceries'],
  ['8b2995d2-022e-4070-8240-878b4243ca0d', 'Organic Honey 500g', 'Pure organic honey in glass jar.', 14.99, 29, 'Groceries'],
  ['b158cf96-8196-4f21-a1f1-696107d2a779', 'Olive Oil 1L', 'Extra virgin olive oil.', 18.5, 31, 'Groceries'],
  ['ee11161d-ab41-49d9-8112-c38fa064ac74', 'Pasta Variety Pack', 'Assorted pasta pack for pantry stock.', 11.99, 52, 'Groceries'],
] as const;

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const userIdByEmail = new Map<string, string>();

  for (const user of users) {
    const seededUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
      },
      create: {
        ...user,
        password,
      },
    });
    userIdByEmail.set(seededUser.email, seededUser.id);
  }

  const categoryIdByName = new Map<string, string>();

  for (const category of categories) {
    const seededCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
      },
      create: category,
    });
    categoryIdByName.set(seededCategory.name, seededCategory.id);
  }

  await prisma.product.createMany({
    data: products.map(([id, name, description, price, stock, categoryName]) => {
      const categoryId = categoryIdByName.get(categoryName);
      if (!categoryId) {
        throw new Error(`Missing seeded category: ${categoryName}`);
      }

      return {
        id,
        name,
        description,
        price,
        stock,
        categoryId,
      };
    }),
    skipDuplicates: true,
  });

  await prisma.verification.createMany({
    data: [
      {
        id: 'b2af86d4-f933-4e22-b0d6-d6c72e604764',
        email: users[0].email,
        token: 'seed-admin-email-verification-token',
        type: VerificationType.EMAIL_VERIFICATION,
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
      },
      {
        id: 'ae158552-f2ad-4fd0-acdc-a32201a09bdc',
        email: users[1].email,
        token: 'seed-user-reset-password-token',
        type: VerificationType.RESET_PASSWORD,
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.session.createMany({
    data: [
      {
        id: 'd9a5e1ee-73ed-46ac-92cb-4a6f9356d517',
        userId: userIdByEmail.get(users[0].email) ?? users[0].id,
        refreshToken: 'seed-admin-refresh-token',
        userAgent: 'Priceyless Seed',
        ipAddress: '127.0.0.1',
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
      },
      {
        id: '7eecb0cd-ed0f-47bc-a6db-60b0e6883472',
        userId: userIdByEmail.get(users[1].email) ?? users[1].id,
        refreshToken: 'seed-user-refresh-token',
        userAgent: 'Priceyless Seed',
        ipAddress: '127.0.0.1',
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completed: 2 users, 5 categories, 20 products, 2 verifications, 2 sessions.');
  console.log('Admin login: admin@priceyless.test / password123');
  console.log('User login: user@priceyless.test / password123');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
