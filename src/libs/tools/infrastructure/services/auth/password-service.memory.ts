import {PasswordServiceInterface} from '/libs/tools';

const passwordServiceInMemoryCreator = (): PasswordServiceInterface => {
  return {
    encode: async (password: string) => password,
    compare: async (suppliedPassword: string, storedPassword: string) => suppliedPassword === storedPassword,
  };
};

export {passwordServiceInMemoryCreator};
