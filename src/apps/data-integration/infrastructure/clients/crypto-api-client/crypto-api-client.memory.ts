import {CryptoClientInterface} from '/apps/data-integration/domain/clients/CryptoClient';
import {CryptoData} from '/apps/data-integration/domain/model/CryptoData';

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
