import { UserRepositoryInterface } from '../../../../common/domain/persistence/user-repository-interface';
import { NotFoundError } from '/libs/dto';

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
      throw new NotFoundError('Invalid user');
    }

    await userRepository.delete(existingUser.id);
  };

export {deleteUserCreator};
