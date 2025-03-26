import {UserRepositoryInterface} from '/apps/users/common/domain/persistence/UserRepository';
import {BadRequestError} from '/libs/dto';
import {JwtServiceInterface, JwtTokenResponse, PasswordServiceInterface} from '/libs/tools';

type LoginUserDependencies = {
  userRepository: UserRepositoryInterface;
  passwordService: PasswordServiceInterface;
  jwtService: JwtServiceInterface;
};

type LoginUserRequest = {
  email: string;
  password: string;
};

type LoginUserResponse = JwtTokenResponse;

const loginUserCreator =
  ({userRepository, passwordService, jwtService}: LoginUserDependencies) =>
  async (user: LoginUserRequest): Promise<LoginUserResponse> => {
    const {email, password} = user;
    const existingUser = await userRepository.findByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await passwordService.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    return jwtService.getSignedJwtTokenResponse({
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role,
    });
  };

export {loginUserCreator};
