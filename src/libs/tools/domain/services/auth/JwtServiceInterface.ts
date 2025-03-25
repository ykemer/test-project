import {UserDto} from 'libs/dto';
import {JwtTokenResponse} from 'libs/tools';

type JwtServiceInterface = {
  getSignedJwtTokenResponse: (payload: UserDto) => JwtTokenResponse;
  getPayload: (token: string) => UserDto | null;
};

export type {JwtServiceInterface};
