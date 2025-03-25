import {USER_ROLES} from 'libs/dto';
import {JwtServiceInterface, JwtTokenResponse} from 'libs/tools';

const jwtServiceInMemory: JwtServiceInterface = {
  getPayload: () => {
    return {
      id: 'id',
      email: 'email',
      role: USER_ROLES.USER,
      name: 'name',
    };
  },
  getSignedJwtTokenResponse: (): JwtTokenResponse => {
    return {
      access_token: 'access_token',
      expires_in: 1,
    };
  },
};

export {jwtServiceInMemory};
