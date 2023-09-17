import * as request from 'supertest';
import { testUser, app, testBankAccount } from './setup.e2e';
import { CardType } from '@prisma/client';

interface CardMock {
  name: string;
  bankAccountId: number;
  finalNumbers: number;
  type: CardType;
}

describe('E2E Card Tests', () => {
  let fakeCard: CardMock;
  let cardId: number;

  beforeAll(() => {
    fakeCard = {
      name: 'Limite total do mês',
      type: 'DEBIT',
      finalNumbers: 2023,
      bankAccountId: testBankAccount.id,
    };
  });

  it('/POST /cards', async () => {
    const response = await request(app.getHttpServer())
      .post('/cards')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCard);

    expect(response.status).toBe(201);
    expect(response.body.final_numbers).toBe(fakeCard.finalNumbers);
    cardId = response.body.id;
  });

  it('/GET /cards/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cards/${cardId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.final_numbers === fakeCard.finalNumbers);
  });

  it('/PATCH /cards/:id', async () => {
    fakeCard.name = 'Conta Corrente Nubank';
    const response = await request(app.getHttpServer())
      .patch(`/cards/${cardId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCard);

    expect(response.status).toBe(200);
    expect(response.body.name === fakeCard.name);
  });

  it('/GET /cards/:bankAccountId', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cards/${testBankAccount.id}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.final_numbers === fakeCard.finalNumbers);
  });

  it('/DELETE /cards/:id', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/cards/${cardId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.final_numbers === fakeCard.finalNumbers);
  });
});
