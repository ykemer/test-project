import {CryptoData} from 'apps/data-integration/domain/model/CryptoData';

type IntegratedData = {
  city: string;
  temperature: string;
  weather: string;
  crypto: CryptoData;
};

export type {IntegratedData};
