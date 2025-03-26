'use strict';
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.error('Admin credentials not found in environment variables');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    return queryInterface.bulkInsert('Users', [
      {
        id: crypto.randomUUID(),
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      email: process.env.ADMIN_EMAIL,
    });
  },
};
