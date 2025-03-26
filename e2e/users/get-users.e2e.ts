import request from 'supertest';

import {sequelize} from '/libs/tools';
import {getConfiguredApp} from '/config/infrastructure';
import {UserDto} from '../../src/libs/dto';
// @ts-ignore
import {prepareTestsWithAdminUser} from './generate-admin-user';

describe('Users API', () => {
  const app = getConfiguredApp();
  let adminToken: string;
  let regularUserToken: string;

  beforeAll(async () => {
    // Connect to test database and sync schema
    await sequelize.sync({force: true});
    const result = await prepareTestsWithAdminUser(sequelize, app);
    adminToken = result.adminToken;
    regularUserToken = result.regularUserToken;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return list of users when authenticated as admin', async () => {
    const {body} = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`).expect(200);

    expect(body.data.length).toEqual(2);
    expect(body.page).toEqual(1);
    expect(body.pageSize).toEqual(10);
    expect(body.total).toEqual(2);
    expect(body.hasNextPage).toBe(false);

    const users = body.data as UserDto[];
    expect(users.some(user => user.email === 'admin@gmail.com')).toBe(true);
    expect(users.some(user => user.email === 'regular@example.com')).toBe(true);
  });

  it('should return paginated data', async () => {
    const {body} = await request(app)
      .get('/api/v1/users?page=1&pageSize=1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(body.data.length).toEqual(1);
    expect(body.page).toEqual(1);
    expect(body.pageSize).toEqual(1);
    expect(body.total).toEqual(2);
    expect(body.hasNextPage).toBe(true);
  });

  it('should return paginated data for second page', async () => {
    const {body} = await request(app)
      .get('/api/v1/users?page=2&pageSize=1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(body.data.length).toEqual(1);
    expect(body.page).toEqual(2);
    expect(body.pageSize).toEqual(1);
    expect(body.total).toEqual(2);
    expect(body.hasNextPage).toBe(false);
  });

  it('should return paginated data when page is out of range', async () => {
    const {body} = await request(app)
      .get('/api/v1/users?page=999&pageSize=1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(body.data.length).toEqual(0);
    expect(body.page).toEqual(999);
    expect(body.pageSize).toEqual(1);
    expect(body.total).toEqual(2);
    expect(body.hasNextPage).toBe(false);
  });

  it('should reject access without admin privileges', async () => {
    return request(app).get('/api/v1/users').set('Authorization', `Bearer ${regularUserToken}`).expect(403);
  });
  it('should reject access without authorization', async () => {
    return request(app).get('/api/v1/users').expect(401);
  });
});
