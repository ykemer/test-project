import {UserRole} from 'libs/dto';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type UserCreateRequest = Omit<User, 'id'>;
type UserUpdateRequest = Partial<UserCreateRequest>;

export type {User, UserCreateRequest, UserUpdateRequest};
