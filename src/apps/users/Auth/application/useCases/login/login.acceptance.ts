import {loginUserCreator} from './login';

import {userBuilder} from '/apps/users/common/test/builders/userBuilder';

import {userRepositoryInMemoryCreator} from '/apps/users/common/infrastructure/persistence/user-repository.memory';
import {jwtServiceInMemory, passwordServiceInMemoryCreator} from '/libs/tools';
import {UserWithPasswordDto} from '../../../../../../libs/dto';

const userRepositoryInMemory = userRepositoryInMemoryCreator();

describe('login', () => {
  beforeEach(() => {
    userRepositoryInMemory.reset();
  });

  it('should login', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    const response = await useCase({
      email: user.email,
      password: user.password,
    });
    expect(response).toEqual({access_token: 'access_token', expires_in: 1});
  });

  it('should throw error when user does not exist', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await expect(
      useCase({
        email: 'non-existing-email',
        password: 'non-existing-password',
      })
    ).rejects.toThrowError('Invalid credentials');
  });

  it('should throw error when user password does not match', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await expect(
      useCase({
        email: user.email,
        password: 'non-existing-password',
      })
    ).rejects.toThrowError('Invalid credentials');
  });
});

const givenValidUser = (user: UserWithPasswordDto) => {
  userRepositoryInMemory.givenUser(user);
};

const givenValidUseCase = () => {
  return loginUserCreator({
    userRepository: userRepositoryInMemory,
    passwordService: passwordServiceInMemoryCreator(),
    jwtService: jwtServiceInMemory,
  });
};
