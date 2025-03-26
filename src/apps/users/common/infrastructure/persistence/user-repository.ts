import {UserModel} from 'libs/tools';

import {UserRepositoryInterface} from '../../domain/persistence/UserRepository';

const userRepositoryCreator = (): UserRepositoryInterface => {
  return {
    listUsers: async request => {
      const {page, pageSize} = request;
      const offset = (page - 1) * pageSize;

      const {rows, count} = await UserModel.findAndCountAll({
        limit: pageSize,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        data: rows.map(user => user.toUserDto()),
        total: count,
      };
    },
    findById: async (id: string) => {
      const user = await UserModel.findByPk(id);
      if (!user) {
        return null;
      }

      return user.toUserWithPasswordDto();
    },
    findByEmail: async (email: string) => {
      const user = await UserModel.findOne({where: {email}});
      if (!user) {
        return null;
      }

      return user.toUserWithPasswordDto();
    },
    create: async user => {
      const newUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      });

      return newUser.toUserDto();
    },
    update: async (id, updates) => {
      const [result] = await UserModel.update(updates, {where: {id}});
      return result > 0;
    },
    delete: async (id: string) => {
      const result = await UserModel.destroy({
        where: {id},
      });

      return result !== 0;
    },
  };
};

export {userRepositoryCreator};
