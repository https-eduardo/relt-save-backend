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
    const response = await request(app.getHttpServer())
      .post('/budgets')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBudget);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(fakeBudget.name);
    budgetId = response.body.id;
  });

  it('/GET /budgets/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/budgets/${budgetId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(fakeBudget.name);
  });

  it('/PATCH /budgets/:id', async () => {
    fakeBudget.name = 'Conta Corrente Nubank';
    const response = await request(app.getHttpServer())
      .patch(`/budgets/${budgetId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeBudget);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(fakeBudget.name);
  });

  it('/GET /budgets', async () => {
    const response = await request(app.getHttpServer())
      .get(`/budgets`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe(fakeBudget.name);
  });

  it('/DELETE /budgets/:id', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/budgets/${budgetId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(fakeBudget.name);
  });
});
