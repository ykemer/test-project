import {jwtServiceCreator} from '/libs/tools';
import {USER_ROLES} from '/libs/dto';

describe('JWT Service Integration', () => {
  it('should sign and verify a token end-to-end', () => {
    const jwtService = jwtServiceCreator();

    const testPayload = {
      id: 'test-user-id',
      email: 'test@example.com',
      role: USER_ROLES.USER,
      name: 'Test User',
    };

    const {access_token} = jwtService.getSignedJwtTokenResponse(testPayload);

    const decodedPayload = jwtService.getPayload(access_token);

    expect(decodedPayload).toEqual(testPayload);
  });

  it('should return null for invalid token', () => {
    const jwtService = jwtServiceCreator();
    const result = jwtService.getPayload('invalid.token.string');
    expect(result).toBeNull();
  });

  it('should return null for tampered token', () => {
    const jwtService = jwtServiceCreator();

    const testPayload = {
      id: 'user-id',
      email: 'user@example.com',
      role: USER_ROLES.USER,
      name: 'Test User',
    };

    const {access_token} = jwtService.getSignedJwtTokenResponse(testPayload);

    const tamperedToken = access_token.slice(0, -1) + (access_token.slice(-1) === 'a' ? 'b' : 'a');

    const result = jwtService.getPayload(tamperedToken);

    expect(result).toBeNull();
  });
});
