import {UserWithPasswordDto} from '/libs/dto';

const userBuilder = (overrides: Partial<UserWithPasswordDto> = {}): UserWithPasswordDto => {
  return {
    id: 'user-id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'user',
    ...overrides,
  };
};

export {userBuilder};
