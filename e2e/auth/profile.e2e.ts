import request from 'supertest';
import {sequelize} from '/libs/tools';
import {getConfiguredApp} from '/config/infrastructure';

describe('Current User', () => {
  const app = getConfiguredApp();
  let authToken: string;
  beforeAll(async () => {
    // Connect to test database and run migrations
    await sequelize.sync({force: true});
    // Register a test user
    await request(app).post('/api/v1/auth/register').send({
      email: 'current@example.com',
      password: 'password123',
      name: 'Test',
    });

    // Get auth token
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'current@example.com',
      password: 'password123',
    });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    // Clean up database connection
    await sequelize.close();
  });

  it('should return current user with valid token', async () => {
    const {body} = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(body).toHaveProperty('email', 'current@example.com');
    expect(body).toHaveProperty('name', 'Test');
    expect(body).toHaveProperty('role', 'user');
  });

  it('should reject with invalid token', async () => {
    return request(app).get('/api/v1/auth/profile').set('Authorization', 'Bearer invalidtoken').expect(401);
  });
});
