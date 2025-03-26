import {UserDto} from 'libs/dto';

import {JwtTokenResponse} from '../../models';

type JwtServiceInterface = {
  getSignedJwtTokenResponse: (payload: UserDto) => JwtTokenResponse;
  getPayload: (token: string) => UserDto | null;
};

export type {JwtServiceInterface};
