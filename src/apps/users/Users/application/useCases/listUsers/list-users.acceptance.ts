import {userBuilder} from '/apps/users/common/test/builders/userBuilder';
import {userRepositoryInMemoryCreator} from '/apps/users/common/infrastructure/persistence/user-repository.memory';
import {listUsersCreator} from '/apps/users/Users/application/useCases/listUsers/list-users';

const userRepositoryInMemory = userRepositoryInMemoryCreator();

describe('list users', () => {
  beforeEach(() => {
    userRepositoryInMemory.reset();
  });

  it('should return list of users when there are more users than page size', async () => {
    givenValidUsers(5);
    const useCase = givenValidUseCase();
    const response = await useCase({
      page: 1,
      pageSize: 3,
    });

    expect(response).toEqual({
      data: expect.arrayContaining([expect.any(Object)]),
      page: 1,
      pageSize: 3,
      total: 5,
      hasNextPage: true,
    });
    expect(response.data.length).toEqual(3);
  });

  it('should return list of users when page size is not equal 1', async () => {
    givenValidUsers(5);
    const useCase = givenValidUseCase();
    const response = await useCase({
      page: 2,
      pageSize: 3,
    });

    expect(response).toEqual({
      data: expect.arrayContaining([expect.any(Object)]),
      page: 2,
      pageSize: 3,
      total: 5,
      hasNextPage: false,
    });
    expect(response.data.length).toEqual(2);
  });

  it('should return empty list when page size * page is more than total number of users', async () => {
    givenValidUsers(5);
    const useCase = givenValidUseCase();
    const response = await useCase({
      page: 2,
      pageSize: 10,
    });

    expect(response).toEqual({
      data: [],
      page: 2,
      pageSize: 10,
      total: 5,
      hasNextPage: false,
    });
    expect(response.data.length).toEqual(0);
  });
});

const givenValidUsers = (numberOfUsers: number) => {
  for (let i = 0; i < numberOfUsers; i++) {
    const user = userBuilder({id: 'user-id-' + i});
    userRepositoryInMemory.givenUser(user);
  }
};

const givenValidUseCase = () => {
  return listUsersCreator({
    userRepository: userRepositoryInMemory,
  });
};
