import request from 'supertest';

import {sequelize} from '/libs/tools';
import {getConfiguredApp} from '/config/infrastructure';
// @ts-ignore
import {prepareTestsWithAdminUser} from './generate-admin-user';

describe('Users API', () => {
  const app = getConfiguredApp();
  let adminToken: string;
  let regularUserId: string;
  let regularUserToken: string;

  beforeAll(async () => {
    // Connect to test database and sync schema
    await sequelize.sync({force: true});
    const result = await prepareTestsWithAdminUser(sequelize, app);
    adminToken = result.adminToken;
    regularUserId = result.regularUserId;
    regularUserToken = result.regularUserToken;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should delete a specific user when authenticated as admin', async () => {
    const beforeDeletionResponse = await request(app).get(`/api/v1/users`).set('Authorization', `Bearer ${adminToken}`);
    const deletionResponse = await request(app)
      .del(`/api/v1/users/${regularUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    const afterDeletionResponse = await request(app).get(`/api/v1/users`).set('Authorization', `Bearer ${adminToken}`);

    expect(deletionResponse.status).toBe(204);
    expect(afterDeletionResponse.body.total).toBe(beforeDeletionResponse.body.total - 1);
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentId = '99999999-9999-9999-9999-999999999999';

    return request(app).del(`/api/v1/users/${nonExistentId}`).set('Authorization', `Bearer ${adminToken}`).expect(404);
  });

  it('should return 400 error if input is not GUID', async () => {
    const nonExistentId = 'not-guid';

    return request(app).del(`/api/v1/users/${nonExistentId}`).set('Authorization', `Bearer ${adminToken}`).expect(400);
  });

  it('should reject access without admin privileges', async () => {
    return request(app)
      .del(`/api/v1/users/${regularUserId}`)
      .set('Authorization', `Bearer ${regularUserToken}`)
      .expect(403);
  });

  it('should reject access without authorization', async () => {
    return request(app).del(`/api/v1/users/${regularUserId}`).expect(401);
  });
});
