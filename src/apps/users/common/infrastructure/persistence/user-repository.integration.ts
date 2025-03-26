import {userRepositoryCreator} from './user-repository';

import {Sequelize} from 'sequelize';
import {USER_ROLES} from '/libs/dto';
import {UserModel} from '/libs/tools';

describe('User Repository', () => {
  let sequelize: Sequelize;
  let userRepository: ReturnType<typeof userRepositoryCreator>;

  beforeAll(async () => {
    // Setup in-memory database
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
    });

    // Re-initialize the model with the test database
    UserModel.init(UserModel.getAttributes(), {
      sequelize,
      modelName: 'User',
    });
  });

  beforeEach(async () => {
    // Sync and clean database before each test
    await sequelize.sync({force: true});
    userRepository = userRepositoryCreator();
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: USER_ROLES.USER,
      };

      const user = await userRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      // Password should not be returned in the DTO
      expect(user).not.toHaveProperty('password');
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: USER_ROLES.USER,
      };

      const createdUser = await UserModel.create(userData);
      const user = await userRepository.findById(createdUser.id);

      expect(user).toBeDefined();
      expect(user!.id).toBe(createdUser.id);
      expect(user!.name).toBe(userData.name);
      expect(user!.email).toBe(userData.email);
      expect(user!.password).toBe(userData.password);
    });

    it('should return null if user not found', async () => {
      const user = await userRepository.findById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: USER_ROLES.USER,
      };

      await UserModel.create(userData);
      const user = await userRepository.findByEmail(userData.email);

      expect(user).toBeDefined();
      expect(user!.email).toBe(userData.email);
      expect(user!.password).toBe(userData.password);
    });

    it('should return null if email not found', async () => {
      const user = await userRepository.findByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('listUsers', () => {
    it('should list users with pagination', async () => {
      // Create multiple users
      const users = [];
      for (let i = 0; i < 15; i++) {
        users.push({
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: 'password',
          role: USER_ROLES.USER,
        });
      }

      await UserModel.bulkCreate(users);

      const result = await userRepository.listUsers({page: 2, pageSize: 5});

      expect(result.data.length).toBe(5);
      expect(result.total).toBe(15);

      expect(result.data[0].email).toBe('user5@example.com');
    });

    it('should return empty array when no users on page', async () => {
      const result = await userRepository.listUsers({page: 3, pageSize: 10});

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('update', () => {
    it('should update user details', async () => {
      const userData = {
        name: 'Original Name',
        email: 'original@example.com',
        password: 'password123',
        role: USER_ROLES.USER,
      };

      const createdUser = await UserModel.create(userData);

      const updates = {
        name: 'Updated Name',
        role: USER_ROLES.ADMIN,
      };

      const result = await userRepository.update(createdUser.id, updates);
      expect(result).toBe(true);

      const updatedUser = await UserModel.findByPk(createdUser.id);
      expect(updatedUser!.name).toBe(updates.name);
      expect(updatedUser!.role).toBe(updates.role);
      expect(updatedUser!.email).toBe(userData.email); // Unchanged
    });

    it('should return false when updating non-existent user', async () => {
      const result = await userRepository.update('non-existent-id', {name: 'New Name'});
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userData = {
        name: 'To Delete',
        email: 'delete@example.com',
        password: 'password123',
        role: USER_ROLES.USER,
      };

      const createdUser = await UserModel.create(userData);

      const result = await userRepository.delete(createdUser.id);
      expect(result).toBe(true);

      const deletedUser = await UserModel.findByPk(createdUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should return false when deleting non-existent user', async () => {
      const result = await userRepository.delete('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
