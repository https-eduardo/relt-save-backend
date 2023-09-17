import * as request from 'supertest';
import { app } from './setup.e2e';

interface UserMock {
  name: string;
  password: string;
  email: string;
  profile_url: string;
}

describe('E2E User Tests', () => {
  let accessToken: string;
  let refreshToken: string;
  let userMock: UserMock;

  beforeAll(() => {
    userMock = {
      name: 'Eduardo Wagner',
      password: 'minhasenha',
      email: 'meuemailfake@gmail.com',
      profile_url: 'https://somesite.com/someimg',
    };
  });

  it('/POST users', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userMock);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(userMock.name);
  });

  it('/POST auth', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth')
      .send({ email: userMock.email, password: userMock.password });

    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it('/GET users/me', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userMock.name);
  });

  it('/POST auth/refresh', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set({ Authorization: `Bearer ${refreshToken}` });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).not.toBe(accessToken);
    expect(response.body.refreshToken).not.toBe(refreshToken);
  });

  it('/POST auth/logout', async () => {
    // The old access token will no longer work just after 10 minutes of creation.
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.status).toBe(200);
  });
});
