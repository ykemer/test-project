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
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      name: 'User',
    });

    expect(response.status).toBe(201);
  });

  it('should return 409 for duplicate email', async () => {
    // First registration
    await request(app).post('/api/v1/auth/register').send({
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'Test',
    });

    // Attempt duplicate registration
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'Test',
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('title');
    expect(response.body.title).toBe('User already exists');
  });

  it('should return 400 if request validation fails', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: '',
      name: '',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
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
