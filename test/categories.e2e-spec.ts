import * as request from 'supertest';
import { testUser, app } from './setup.e2e';

interface CategoryMock {
  name: string;
  color: string;
}

describe('E2E Categories Tests', () => {
  let fakeCategory: CategoryMock;
  let categoryId: number;

  beforeAll(() => {
    fakeCategory = {
      name: 'Categoria teste',
      color: '#fffccc',
    };
  });

  it('/POST /categories', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCategory);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(fakeCategory.name);
    categoryId = response.body.id;
  });

  it('/GET /categories/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/categories/${categoryId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(fakeCategory.name);
  });

  it('/PATCH /categories/:id', async () => {
    fakeCategory.name = 'Conta Corrente Nubank';
    const response = await request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCategory);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(fakeCategory.name);
  });

  it('/GET /categories', async () => {
    const response = await request(app.getHttpServer())
      .get(`/categories`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe(fakeCategory.name);
  });

  it('/DELETE /categories/:id', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(fakeCategory.name);
  });
});
