import {UserRepositoryInterface} from 'apps/users/common/domain/persistence/UserRepository';
import {BadRequestError} from 'libs/dto';

type DeleteUserDependencies = {
  userRepository: UserRepositoryInterface;
};

type DeleteUserRequest = {
  id: string;
};

type DeleteUserResponse = void;

const deleteUserCreator =
  ({userRepository}: DeleteUserDependencies) =>
  async (user: DeleteUserRequest): Promise<DeleteUserResponse> => {
    const {id} = user;
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new BadRequestError('Invalid user');
    }

    await userRepository.delete(existingUser.id);
  };

export {deleteUserCreator};
