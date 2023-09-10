import * as request from 'supertest';
import { testUser, app } from './setup.e2e';

interface BankAccountMock {
  name: string;
  balance: number;
  bankId: number;
}

describe('Bank tests', () => {
  let fakeBankAccount: BankAccountMock;
  let bankAccountId: number;

  beforeAll(() => {
    fakeBankAccount = {
      name: 'Poupança Nubank',
      bankId: 6,
      balance: 25000,
    };
  });

  it('/POST /bank-account', async () => {
    const data = await request(app.getHttpServer())
      .post('/bank-account')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBankAccount);
    expect(data.status).toBe(201);
    expect(data.body.name).toBe(fakeBankAccount.name);
    bankAccountId = data.body.id;
  });

  it('/GET /bank-account/:id', () => {
    return request(app.getHttpServer())
      .get(`/bank-account/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });

  it('/PATCH /bank-account/:id', () => {
    fakeBankAccount.name = 'Conta Corrente Nubank';
    return request(app.getHttpServer())
      .patch(`/bank-account/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBankAccount)
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });

  it('/GET /bank-account/:userId', () => {
    return request(app.getHttpServer())
      .get(`/bank-account/${testUser.id}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });

  it('/DELETE /bank-account/:id', () => {
    return request(app.getHttpServer())
      .delete(`/bank-account/${bankAccountId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBankAccount.name);
  });
});
