import path from 'path';
import fs from 'fs';
import request from 'supertest';
import {Sequelize} from 'sequelize';
import {Express} from 'express';

const prepareTestsWithAdminUser = async (sequelize: Sequelize, app: Express) => {
  // Run admin seed programmatically
  let adminToken;
  let regularUserToken;
  let regularUserId;
  try {
    const seedsDir = path.join(process.cwd(), './src/libs/tools/infrastructure/db/seeders/');
    const seedFiles = fs.readdirSync(seedsDir).filter(file => file.includes('admin-user'));

    for (const seedFile of seedFiles) {
      const seed = require(path.join(seedsDir, seedFile));
      await seed.up(sequelize.getQueryInterface(), sequelize);
    }
  } catch (error) {
    console.error('Error running admin seed:', error);
  }

  // Login with the seeded admin account
  const adminLoginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'admin@gmail.com',
    password: 'admin',
  });

  adminToken = adminLoginResponse.body.access_token;

  // Create a regular user for testing
  await request(app).post('/api/v1/auth/register').send({
    email: 'regular@example.com',
    password: 'password123',
    name: 'Regular User',
  });

  // Login as regular user to get token
  const regularLoginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'regular@example.com',
    password: 'password123',
  });

  regularUserToken = regularLoginResponse.body.access_token;

  // Get user ID from profile
  const profileResponse = await request(app)
    .get('/api/v1/auth/profile')
    .set('Authorization', `Bearer ${regularUserToken}`);

  regularUserId = profileResponse.body.id;

  return {adminToken, regularUserId, regularUserToken};
};

export {prepareTestsWithAdminUser};
