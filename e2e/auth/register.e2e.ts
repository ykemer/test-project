import request from 'supertest';
import {sequelize} from '/libs/tools';
import {getConfiguredApp} from '/config/infrastructure';

describe('Registration', () => {
  const app = getConfiguredApp();
  beforeAll(async () => {
    // Connect to test database and run migrations
    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    // Clean up database connection
    await sequelize.close();
  });

  it('should register a new user successfully', async () => {
    return await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'User',
      })
      .expect(201);
  });

  it('should return 409 for duplicate email', async () => {
    // First registration
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test',
      })
      .expect(201);

    // Attempt duplicate registration
    const {body} = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test',
      })
      .expect(409);

    expect(body).toHaveProperty('title', 'User already exists');
  });

  it('should return 400 if request validation fails', async () => {
    const {body} = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: '',
        name: '',
        password: '',
      })
      .expect(400);

    expect(body.errors).toEqual([
      {
        message: 'Email must be valid',
        field: 'email',
      },
      {
        message: 'Name should not be empty',
        field: 'name',
      },
      {
        message: 'Password must be between 4 and 20 characters',
        field: 'password',
      },
    ]);
  });
});
