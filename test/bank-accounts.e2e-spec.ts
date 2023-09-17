import * as request from 'supertest';
import { testUser, app } from './setup.e2e';

interface BankAccountMock {
  name: string;
  balance: number;
  bankId: number;
}

describe('E2E Bank Tests', () => {
  let bankAccountMock: BankAccountMock;
  let bankAccountId: number;

  beforeAll(() => {
    bankAccountMock = {
      name: 'Poupança Nubank',
      bankId: 6,
      balance: 25000,
    };
  });

  it('/POST /bank-accounts', async () => {
    const response = await request(app.getHttpServer())
      .post('/bank-accounts')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(bankAccountMock);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(bankAccountMock.name);
    bankAccountId = response.body.id;
  });

  it('/GET /bank-accounts/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/bank-accounts/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(bankAccountMock.name);
  });

  it('/PATCH /bank-accounts/:id', async () => {
    bankAccountMock.name = 'Conta Corrente Nubank';
    const response = await request(app.getHttpServer())
      .patch(`/bank-accounts/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(bankAccountMock);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(bankAccountMock.name);
  });

  it('/GET /bank-accounts', async () => {
    const response = await request(app.getHttpServer())
      .get(`/bank-accounts`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body[0].user_id).toBe(testUser.id);
  });

  it('/DELETE /bank-accounts/:id', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/bank-accounts/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(bankAccountMock.name);
  });
});
