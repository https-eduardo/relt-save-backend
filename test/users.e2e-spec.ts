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
  let fakeUser: UserMock;

  beforeAll(() => {
    fakeUser = {
      name: 'Eduardo Wagner',
      password: 'minhasenha',
      email: 'meuemailfake@gmail.com',
      profile_url: 'https://somesite.com/someimg',
    };
  });

  it('/POST users', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(fakeUser)
      .expect(201)
      .expect((res) => res.body.email === fakeUser.email);
  });

  it('/POST auth', async () => {
    const data = await request(app.getHttpServer())
      .post('/auth')
      .send({ email: fakeUser.email, password: fakeUser.password });

    expect(data.statusCode).toBe(200);
    accessToken = data.body.accessToken;
    refreshToken = data.body.refreshToken;
    expect(data.body.accessToken).toBeDefined();
    expect(data.body.refreshToken).toBeDefined();
  });

  it('/GET users/me', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200)
      .expect((res) => res.body.email === fakeUser.email);
  });

  it('/POST auth/refresh', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .set({ Authorization: `Bearer ${refreshToken}` })
      .expect(200)
      .expect((res) => res.body.accessToken !== accessToken)
      .expect((res) => res.body.refreshToken !== refreshToken);
  });

  it('/POST auth/logout', () => {
    // The old access token will no longer work just after 10 minutes of creation.
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });
});
