import * as request from 'supertest';
import { testUser, app } from './setup.e2e';
import { PaymentType } from '@prisma/client';

interface TransactionMock {
  name: string;
  description: string;
  categories?: [];
  paymentType: PaymentType;
  dueDate?: Date;
  installments?: number;
  value: number;
  paidAt?: Date;
}

describe('E2E Bank Tests', () => {
  let transactionMock: TransactionMock;
  let transactionId: number;

  beforeAll(() => {
    transactionMock = {
      name: 'Lanchinho',
      description: 'Lanchinho que comprei na cantina',
      paymentType: PaymentType.PHYSICAL_MONEY,
      value: 6,
      installments: 1,
      paidAt: new Date(),
    };
  });

  it('/POST /transactions', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(transactionMock);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(transactionMock.name);
    transactionId = response.body.id;
  });

  it('/GET /transactions/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/transactions/${transactionId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(transactionMock.name);
  });

  it('/PATCH /transactions/:id', async () => {
    transactionMock.paymentType = PaymentType.BALANCE;
    const response = await request(app.getHttpServer())
      .patch(`/transactions/${transactionId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(transactionMock);

    expect(response.status).toBe(200);
    expect(response.body.payment_type).toBe(transactionMock.paymentType);
  });

  it('/GET /transactions', async () => {
    const response = await request(app.getHttpServer())
      .get(`/transactions?paid=true&type=incomes`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe(transactionMock.name);
  });

  it('/DELETE /transactions/:id', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/transactions/${transactionId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(transactionMock.name);
  });
});
