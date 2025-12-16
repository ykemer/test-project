import {weatherApiClientInMemoryCreator} from '../../infrastructure/clients/weather-api-client/weather-api-client.memory';
import {cryptoApiClientInMemoryCreator} from '../../infrastructure/clients/crypto-api-client/crypto-api-client.memory';
import {getIntegratedDataCreator} from './get-integrated-data';

const weatherApiClient = weatherApiClientInMemoryCreator();
const cryptoApiClient = cryptoApiClientInMemoryCreator();

describe('Get Integrated Data Acceptance', () => {
  beforeEach(() => {
    weatherApiClient.reset();
    cryptoApiClient.reset();
  });

  it('should register new user', async () => {
    givenValidCryptoApiResponse();
    givenValidWeatherApiResponse();
    const useCase = givenValidUseCase();
    const output = await useCase({
      city: 'Tbilisi',
      currency: 'bitcoin',
    });
    expect(output).toEqual({
      city: 'Tbilisi',
      crypto: {
        name: 'bitcoin',
        price_usd: 1000,
      },
      temperature: '20',
      weather: 'sunny',
    });
  });

  it('should throw error when weather api client throws an error', async () => {
    givenValidCryptoApiResponse();
    const useCase = givenValidUseCase();

    await expect(
      useCase({
        city: 'Tbilisi',
        currency: 'bitcoin',
      })
    ).rejects.toThrow('City not found');
  });

  it('should throw error when crypto api client throws an error', async () => {
    givenValidWeatherApiResponse();
    const useCase = givenValidUseCase();

    await expect(
      useCase({
        city: 'Tbilisi',
        currency: 'bitcoin',
      })
    ).rejects.toThrow('Crypto not found');
  });
});

const givenValidCryptoApiResponse = () => {
  cryptoApiClient.givenValidOutput({
    name: 'bitcoin',
    price_usd: 1000,
  });
};

const givenValidWeatherApiResponse = () => {
  weatherApiClient.givenValidOutput({
    city: 'Tbilisi',
    temperature: '20',
    weather: 'sunny',
  });
};

const givenValidUseCase = () => {
  return getIntegratedDataCreator({
    cryptoClient: cryptoApiClient,
    weatherClient: weatherApiClient,
  });
};
