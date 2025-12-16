import {getUserProfileCreator} from './getUserProfile';

import {userRepositoryInMemoryCreator} from '/apps/users/common/infrastructure/persistence/user-repository.memory';
import {userBuilder} from '/apps/users/common/test/builders/userBuilder';
import {UserWithPasswordDto} from '../../../../../../libs/dto';

const userRepositoryInMemory = userRepositoryInMemoryCreator();

describe('profile', () => {
  beforeEach(() => {
    userRepositoryInMemory.reset();
  });

  it('should return user profile', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    const response = await useCase({
      id: user.id,
    });
    expect(response).toEqual({
      email: 'email',
      id: 'user-id',
      name: 'name',
      role: 'user',
    });
  });

  it('should throw error if id is not correct', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await expect(
      useCase({
        id: 'bad-id',
      })
    ).rejects.toThrow();
  });
});

const givenValidUser = (user: UserWithPasswordDto) => {
  userRepositoryInMemory.givenUser(user);
};

const givenValidUseCase = () => {
  return getUserProfileCreator({
    userRepository: userRepositoryInMemory,
  });
};
