import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface TestUser {
  id: number;
  accessToken: string;
}

export let app: INestApplication;
export let testUser: TestUser;

async function setupAuth() {
  const prisma = new PrismaClient();

  const userData = {
    email: 'testuser@gmail.com',
    name: 'testuser',
    password: 'senhateste',
  };

  const user = await prisma.user.upsert({
    create: userData,
    update: userData,
    where: { email: userData.email },
  });
  const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });
  testUser = { id: user.id, accessToken };
}

global.beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await setupAuth();
  await app.init();
});

global.afterAll(async () => {
  await app.close();
});
