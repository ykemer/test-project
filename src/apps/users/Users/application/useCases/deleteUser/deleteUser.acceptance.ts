import {userRepositoryInMemoryCreator} from 'apps/users/common/infrastructure/persistence/user-repository.memory';
import {userBuilder} from 'apps/users/common/test/builders/userBuilder';
import {deleteUserCreator} from 'apps/users/Users/application/useCases/deleteUser/deleteUser';
import {UserWithPasswordDto} from '/libs/dto';

const userRepositoryInMemory = userRepositoryInMemoryCreator();

describe('delete user', () => {
  beforeEach(() => {
    userRepositoryInMemory.reset();
  });

  it('should delete user', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await useCase({
      id: user.id,
    });
    expect(userRepositoryInMemory.users.length).toEqual(0);
  });

  it('should throw error if id is not correct', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await expect(
      useCase({
        id: 'bad-id',
      })
    ).rejects.toThrowError('Invalid user');
  });
});

const givenValidUser = (user: UserWithPasswordDto) => {
  userRepositoryInMemory.givenUser(user);
};

const givenValidUseCase = () => {
  return deleteUserCreator({
    userRepository: userRepositoryInMemory,
  });
};
