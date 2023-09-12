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
    const data = await request(app.getHttpServer())
      .post('/categories')
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCategory);
    expect(data.status).toBe(201);
    expect(data.body.name).toBe(fakeCategory.name);
    categoryId = data.body.id;
  });

  it('/GET /categories/:id', () => {
    return request(app.getHttpServer())
      .get(`/categories/${categoryId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeCategory.name);
  });

  it('/PATCH /categories/:id', () => {
    fakeCategory.name = 'Conta Corrente Nubank';
    return request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .send(fakeCategory)
      .expect(200)
      .expect((res) => res.body.name === fakeCategory.name);
  });

  it('/GET /categories', () => {
    return request(app.getHttpServer())
      .get(`/categories`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeCategory.name);
  });

  it('/DELETE /categories/:id', () => {
    return request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .set({ Authorization: `Bearer ${testUser.accessToken}` })
      .expect(200)
      .expect((res) => res.body.name === fakeCategory.name);
  });
});
