type UserRole = 'admin' | 'user';
const USER_ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  USER: 'user',
};

type UserDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type UserWithPasswordDto = UserDto & {
  password: string;
};

export type {UserDto, UserRole, UserWithPasswordDto};
export {USER_ROLES};
