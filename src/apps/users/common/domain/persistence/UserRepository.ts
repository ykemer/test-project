import {PaginatedRequest, UserDto, UserWithPasswordDto} from '/libs/dto';

import {UserCreateRequest, UserUpdateRequest} from '../models/User';

type UserRepositoryInterface = {
  listUsers: (request: PaginatedRequest) => Promise<{data: UserDto[]; total: number}>;
  findById: (id: string) => Promise<UserWithPasswordDto | null>;
  findByEmail: (email: string) => Promise<UserWithPasswordDto | null>;
  create: (user: UserCreateRequest) => Promise<UserDto>;
  update: (id: string, user: UserUpdateRequest) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
};

export type {UserRepositoryInterface};
