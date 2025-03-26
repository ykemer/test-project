import {UserRepositoryInterface} from '/apps/users/common/domain/persistence/UserRepository';
import {UserDto, PaginatedResponse} from '/libs/dto';

type ListUsersDependencies = {
  userRepository: UserRepositoryInterface;
};

type ListUsersRequest = {
  page: number;
  pageSize: number;
};

type ListUsersResponse = PaginatedResponse<UserDto>;

const listUsersCreator =
  ({userRepository}: ListUsersDependencies) =>
  async ({page, pageSize}: ListUsersRequest): Promise<ListUsersResponse> => {
    const {data, total} = await userRepository.listUsers({page, pageSize});
    return {
      data,
      page,
      pageSize,
      total,
      hasNextPage: page * pageSize < total,
    };
  };

export {listUsersCreator};
