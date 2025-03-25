import {UserRepositoryInterface} from 'apps/users/common/domain/persistence/UserRepository';
import {BadRequestError, NotFoundError, UserWithPasswordDto} from 'libs/dto';
import {PasswordServiceInterface} from 'libs/tools';

type UpdateUserDependencies = {
  userRepository: UserRepositoryInterface;
  passwordService: PasswordServiceInterface;
};

type UpdateUserRequest = {
  id: string;
  updates: Partial<Omit<UserWithPasswordDto, 'id'>>;
};

type UpdateUserResponse = void;

const updateUserCreator =
  ({userRepository, passwordService}: UpdateUserDependencies) =>
  async ({id, updates}: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    if (Object.keys(updates).length === 0) {
      throw new BadRequestError('User could not be updated');
    }

    if (updates.password) {
      updates.password = await passwordService.encode(updates.password);
    }

    await userRepository.update(id, updates);
  };

export {updateUserCreator};
