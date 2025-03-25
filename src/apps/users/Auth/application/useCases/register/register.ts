import {UserRepositoryInterface} from 'apps/users/common/domain/persistence/UserRepository';
import {ConflictError, USER_ROLES} from 'libs/dto';
import {PasswordServiceInterface} from 'libs/tools';

type RegisterUserDependencies = {
  userRepository: UserRepositoryInterface;
  passwordService: PasswordServiceInterface;
};

type UserRegisterRequest = {
  name: string;
  email: string;
  password: string;
};

const registerUserCreator =
  ({userRepository, passwordService}: RegisterUserDependencies) =>
  async (user: UserRegisterRequest): Promise<void> => {
    const {name, email, password} = user;
    const hashedPassword = await passwordService.encode(password);

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    await userRepository.create({name, email, password: hashedPassword, role: USER_ROLES.USER});
  };

export {registerUserCreator};
