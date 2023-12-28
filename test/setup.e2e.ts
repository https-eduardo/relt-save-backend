import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface TestUser {
  id: number;
  accessToken: string;
}

interface TestBankAccount {
  id: number;
}

const prisma = new PrismaClient();
export let app: INestApplication;
export let testUser: TestUser;
export let testBankAccount: TestBankAccount;

async function setupAuth() {
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

async function setupBankAccount() {
  const bankAccountData = {
    name: 'Test Bank Account',
    user_id: testUser.id,
    bank_id: 1,
    balance: 1000,
  };

  const bankAccount = await prisma.bankAccount.create({
    data: bankAccountData,
  });

  testBankAccount = { id: bankAccount.id };
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
  await setupBankAccount();
  await app.init();
});

global.afterAll(async () => {
  await app.close();
});
