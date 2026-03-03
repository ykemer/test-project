import { UserRepositoryInterface } from '../../../domain/persistence/user-repository-interface';
import { NotFoundError, UserDto } from '/libs/dto';
import { omit } from '/libs/tools';

type GetUserProfileDependencies = {
  userRepository: UserRepositoryInterface;
};

type GetUserProfileRequest = {
  id: string;
};

type GetUserProfileResponse = UserDto;

const getUserProfileCreator =
  ({userRepository}: GetUserProfileDependencies) =>
  async (user: GetUserProfileRequest): Promise<GetUserProfileResponse> => {
    const {id} = user;
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    return omit(existingUser, ['password']);
  };

export {getUserProfileCreator};
