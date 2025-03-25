import {userBuilder} from 'apps/users/common/test/builders/userBuilder';
import {userRepositoryInMemoryCreator} from 'apps/users/common/infrastructure/persistence/user-repository.memory';
import {UserWithPasswordDto} from 'libs/dto';
import {updateUserCreator} from 'apps/users/Users/application/useCases/updateUser/update-user';
import {passwordServiceInMemoryCreator} from 'libs/tools';

const userRepositoryInMemory = userRepositoryInMemoryCreator();

describe('update user', () => {
  beforeEach(() => {
    userRepositoryInMemory.reset();
  });

  it('should partially update user', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await useCase({
      id: user.id,
      updates: {
        name: 'new name',
        password: 'new password',
      },
    });

    expect(userRepositoryInMemory.users[0].id).toEqual(user.id);
    expect(userRepositoryInMemory.users[0].email).toEqual(user.email);
    expect(userRepositoryInMemory.users[0].name).toEqual('new name');
    expect(userRepositoryInMemory.users[0].password).toEqual('new password');
  });

  it('should throw error if id is not correct', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await expect(
      useCase({
        id: 'non-existing-id',
        updates: {
          name: 'new name',
          password: 'new password',
        },
      })
    ).rejects.toThrowError('User not found');
  });

  it('should throw error if update request is empty', async () => {
    const user = userBuilder();
    givenValidUser(user);
    const useCase = givenValidUseCase();
    await expect(
      useCase({
        id: user.id,
        updates: {},
      })
    ).rejects.toThrowError('User could not be updated');
  });
});

const givenValidUser = (user: UserWithPasswordDto) => {
  userRepositoryInMemory.givenUser(user);
};

const givenValidUseCase = () => {
  return updateUserCreator({
    userRepository: userRepositoryInMemory,
    passwordService: passwordServiceInMemoryCreator(),
  });
};
