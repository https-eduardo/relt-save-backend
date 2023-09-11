import * as request from 'supertest';
import { testUser, app } from './setup.e2e';

interface BankAccountMock {
  name: string;
  balance: number;
  bankId: number;
}

describe('E2E Bank Tests', () => {
  let fakeBankAccount: BankAccountMock;
  let bankAccountId: number;

  beforeAll(() => {
    fakeBankAccount = {
      name: 'Poupança Nubank',
      bankId: 6,
      balance: 25000,
    };
  });

  it('/POST /bank-accounts', async () => {
    const data = await request(app.getHttpServer())
      .post('/bank-accounts')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBankAccount);
    expect(data.status).toBe(201);
    expect(data.body.name).toBe(fakeBankAccount.name);
    bankAccountId = data.body.id;
  });

  it('/GET /bank-accounts/:id', () => {
    return request(app.getHttpServer())
      .get(`/bank-accounts/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });

  it('/PATCH /bank-accounts/:id', () => {
    fakeBankAccount.name = 'Conta Corrente Nubank';
    return request(app.getHttpServer())
      .patch(`/bank-accounts/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBankAccount)
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });

  it('/GET /bank-accounts/:userId', () => {
    return request(app.getHttpServer())
      .get(`/bank-accounts/${testUser.id}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });

  it('/DELETE /bank-accounts/:id', () => {
    return request(app.getHttpServer())
      .delete(`/bank-accounts/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });
});
