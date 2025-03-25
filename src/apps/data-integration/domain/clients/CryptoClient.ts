import {CryptoData} from 'apps/data-integration/domain/model/CryptoData';

type CryptoClientInterface = {
  getCryptoPrices(coin: string, forceRefresh?: boolean): Promise<CryptoData>;
};

type CryptoApiResponse = {
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
  };
};

export type {CryptoApiResponse, CryptoClientInterface};
