import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';

import {UserDto, UserWithPasswordDto} from 'libs/dto';

import {sequelize} from '../sequelize';

class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: 'admin' | 'user';

  toUserWithPasswordDto(): UserWithPasswordDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }

  toUserDto(): UserDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

export {UserModel};
