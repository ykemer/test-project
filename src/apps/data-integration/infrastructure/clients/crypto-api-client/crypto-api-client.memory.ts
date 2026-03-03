import {CryptoClientInterface} from '../../../domain/clients/crypto-client-interface';
import {CryptoData} from '../../../domain/model/crypto-data';

const cryptoApiClientInMemoryCreator = (): CryptoClientInterface & {
  output: CryptoData | undefined;
  givenValidOutput: (output: CryptoData) => void;
  reset: () => void;
} => {
  return {
    output: undefined,
    reset: function () {
      this.output = undefined;
    },
    givenValidOutput: function (output) {
      this.output = output;
    },
    getCryptoPrices: function () {
      if (!this.output) {
        throw new Error('Crypto not found');
      }
      return Promise.resolve(this.output);
    },
  };
};

export {cryptoApiClientInMemoryCreator};
