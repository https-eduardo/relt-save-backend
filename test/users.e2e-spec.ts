import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';

interface UserMock {
  name: string;
  password: string;
  email: string;
  profile_url: string;
}

describe('Users Tests (E2E)', () => {
  let app: INestApplication;
  let fakeUser: UserMock;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    fakeUser = {
      name: 'Eduardo Wagner',
      password: 'minhasenha',
      email: 'meuemailfake@gmail.com',
      profile_url: 'https://localhost.com',
    };

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('Create a new user', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(fakeUser)
      .expect(201)
      .expect((res) => res.body.email === fakeUser.email);
  });

  it('Authenticate using created user credentials', async () => {
    const data = await request(app.getHttpServer())
      .post('/auth')
      .send({ email: fakeUser.email, password: fakeUser.password });

    expect(data.statusCode).toBe(200);
    accessToken = data.body.accessToken;
    refreshToken = data.body.refreshToken;
    expect(data.body.accessToken).toBeDefined();
    expect(data.body.refreshToken).toBeDefined();
  });

  it('Fetch own user data', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200)
      .expect((res) => res.body.email === fakeUser.email);
  });

  it('Update access and refresh token', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .set({ Authorization: `Bearer ${refreshToken}` })
      .expect(200)
      .expect((res) => res.body.accessToken !== accessToken)
      .expect((res) => res.body.refreshToken !== refreshToken);
  });

  it('Logout user', () => {
    // The old access token will no longer work just after 10 minutes of creation.
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
