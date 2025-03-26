import crypto from 'node:crypto';

import {UserRepositoryInterface} from '/apps/users/common/domain/persistence/UserRepository';
import {UserWithPasswordDto} from '/libs/dto';

const userRepositoryInMemoryCreator = (): UserRepositoryInterface & {
  users: UserWithPasswordDto[];
  givenUser: (user: UserWithPasswordDto) => void;
  reset: () => void;
} => {
  return {
    users: [],
    reset: function () {
      this.users = [];
    },
    givenUser: function (user) {
      this.users.push(user);
    },
    listUsers: async function (request) {
      const {page, pageSize} = request;
      const offset = (page - 1) * pageSize;

      return {
        total: this.users.length,
        data: this.users.slice(offset, offset + pageSize).map(user => user),
      };
    },
    findById: async function (id: string) {
      const user = this.users.find(user => user.id === id);
      if (!user) {
        return Promise.resolve(null);
      }
      return Promise.resolve(user);
    },
    findByEmail: async function (email: string) {
      const user = this.users.find(user => user.email === email);
      if (!user) {
        return Promise.resolve(null);
      }
      return Promise.resolve(user);
    },
    create: function (user) {
      const newUser = {
        id: crypto.randomUUID(),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      };
      this.users.push(newUser);

      return Promise.resolve(newUser);
    },
    update: async function (id, user) {
      const existingUserIndex = this.users.findIndex(user => user.id === id);
      if (existingUserIndex === -1) {
        return Promise.resolve(false);
      }

      const existingUser = this.users[existingUserIndex];
      this.users[existingUserIndex] = {
        ...existingUser,
        ...user,
      };

      return Promise.resolve(true);
    },
    delete: async function (id: string) {
      const existingUserIndex = this.users.findIndex(user => user.id === id);
      if (existingUserIndex === -1) {
        return Promise.resolve(false);
      }

      this.users = this.users.filter(user => user.id !== id);
      return Promise.resolve(true);
    },
  };
};

export {userRepositoryInMemoryCreator};
