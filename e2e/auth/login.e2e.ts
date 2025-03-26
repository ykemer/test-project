import request from 'supertest';
import {sequelize} from '/libs/tools';
import {getConfiguredApp} from '/config/infrastructure';

describe('Login', () => {
  const app = getConfiguredApp();
  beforeAll(async () => {
    // Connect to test database and run migrations
    await sequelize.sync({force: true});
    // Create a test user
    await request(app).post('/api/v1/auth/register').send({
      email: 'login@example.com',
      password: 'password123',
      name: 'Login',
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should login successfully with valid credentials', async () => {
    const {body} = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('expires_in');
  });

  it('should fail with invalid credentials', async () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      })
      .expect(400);
  });
});
