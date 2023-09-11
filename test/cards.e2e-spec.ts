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
    const data = await request(app.getHttpServer())
      .post('/cards')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCard);
    expect(data.status).toBe(201);
    expect(data.body.final_numbers).toBe(fakeCard.finalNumbers);
    cardId = data.body.id;
  });

  it('/GET /cards/:id', () => {
    return request(app.getHttpServer())
      .get(`/cards/${cardId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.final_numbers === fakeCard.finalNumbers);
  });

  it('/PATCH /cards/:id', () => {
    fakeCard.name = 'Conta Corrente Nubank';
    return request(app.getHttpServer())
      .patch(`/cards/${cardId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCard)
      .expect(200)
      .expect((res) => res.body.final_numbers === fakeCard.finalNumbers);
  });

  it('/GET /cards/:userId', () => {
    return request(app.getHttpServer())
      .get(`/cards/${testUser.id}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.final_numbers === fakeCard.finalNumbers);
  });

  it('/DELETE /cards/:id', () => {
    return request(app.getHttpServer())
      .delete(`/cards/${cardId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.final_numbers === fakeCard.finalNumbers);
  });
});
