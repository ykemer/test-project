import {passwordServiceCreator} from '/libs/tools';

describe('Password Service Integration', () => {
  const passwordService = passwordServiceCreator();

  describe('encode and compare', () => {
    it('should correctly encode and verify a password', async () => {
      // Test password
      const password = 'test-password-123';

      // Encode the password
      const encodedPassword = await passwordService.encode(password);

      // Verify the password matches
      const isMatch = await passwordService.compare(password, encodedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing with incorrect password', async () => {
      // Test password
      const password = 'test-password-123';
      const wrongPassword = 'wrong-password';

      // Encode the password
      const encodedPassword = await passwordService.encode(password);

      // Verify wrong password doesn't match
      const isMatch = await passwordService.compare(wrongPassword, encodedPassword);
      expect(isMatch).toBe(false);
    });

    it('should generate different hashes for the same password', async () => {
      // Test password
      const password = 'same-password';

      // Encode the password twice
      const encodedPassword1 = await passwordService.encode(password);
      const encodedPassword2 = await passwordService.encode(password);

      // Hashes should be different due to different salts
      expect(encodedPassword1).not.toBe(encodedPassword2);

      // But both should verify correctly
      const isMatch1 = await passwordService.compare(password, encodedPassword1);
      const isMatch2 = await passwordService.compare(password, encodedPassword2);

      expect(isMatch1).toBe(true);
      expect(isMatch2).toBe(true);
    });

    it('should not match when hash is tampered', async () => {
      // Test password
      const password = 'test-password-123';

      // Encode the password
      const encodedPassword = await passwordService.encode(password);

      // Tamper with the hash (replace a character)
      const tamperedHash = encodedPassword.substring(0, 10) + 'X' + encodedPassword.substring(11);

      // Verify tampered hash doesn't match
      const isMatch = await passwordService.compare(password, tamperedHash);
      expect(isMatch).toBe(false);
    });
  });
});
