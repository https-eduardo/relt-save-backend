import * as request from 'supertest';
import { testUser, app } from './setup.e2e';

interface BudgetMock {
  name: string;
  description: string;
  value: number;
  dueDate: string;
}

describe('E2E Budget Tests', () => {
  let fakeBudget: BudgetMock;
  let budgetId: number;

  beforeAll(() => {
    fakeBudget = {
      name: 'Limite total do mês',
      description:
        'Os gastos do mês de Outubro não podem ultrapassar essa barreira.',
      value: 5000,
      dueDate: new Date().toISOString(),
    };
  });

  it('/POST /budgets', async () => {
    const data = await request(app.getHttpServer())
      .post('/budgets')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBudget);
    expect(data.status).toBe(201);
    expect(data.body.name).toBe(fakeBudget.name);
    budgetId = data.body.id;
  });

  it('/GET /budgets/:id', () => {
    return request(app.getHttpServer())
      .get(`/budgets/${budgetId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBudget.name);
  });

  it('/PATCH /budgets/:id', () => {
    fakeBudget.name = 'Conta Corrente Nubank';
    return request(app.getHttpServer())
      .patch(`/budgets/${budgetId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBudget)
      .expect(200)
      .expect((res) => res.body.name === fakeBudget.name);
  });

  it('/GET /budgets/:userId', () => {
    return request(app.getHttpServer())
      .get(`/budgets/${testUser.id}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBudget.name);
  });

  it('/DELETE /budgets/:id', () => {
    return request(app.getHttpServer())
      .delete(`/budgets/${budgetId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeBudget.name);
  });
});
