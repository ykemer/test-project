import {registerUserCreator} from './register';


import {userBuilder} from 'apps/users/common/test/builders/userBuilder';
import {userRepositoryInMemoryCreator} from 'apps/users/common/infrastructure/persistence/user-repository.memory';
import {passwordServiceInMemoryCreator} from 'libs/tools';
import {UserWithPasswordDto} from "../../../../../../libs/dto";

const userRepositoryInMemory = userRepositoryInMemoryCreator();

describe('register', () => {
  beforeEach(() => {
    userRepositoryInMemory.reset();
  });

  it('should register new user', async () => {
    const useCase = givenValidUseCase();
    await useCase({
      email: 'email',
      name: 'name',
      password: 'password',
    });
    expect(userRepositoryInMemory.users[0]).toEqual({
      email: 'email',
      id: expect.any(String),
      name: 'name',
      role: 'user',
      password: 'password',
    });
  });

  it('should throw error if user has non unique email', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await expect(
      useCase({
        email: user.email,
        name: 'name',
        password: 'password',
      })
    ).rejects.toThrowError('User already exists');
  });
});

const givenValidUser = (user: UserWithPasswordDto) => {
  userRepositoryInMemory.givenUser(user);
};

const givenValidUseCase = () => {
  return registerUserCreator({
    userRepository: userRepositoryInMemory,
    passwordService: passwordServiceInMemoryCreator(),
  });
};
