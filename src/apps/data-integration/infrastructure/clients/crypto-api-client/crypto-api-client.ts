import {CryptoClientInterface} from '/apps/data-integration/domain/clients/CryptoClient';
import {NotFoundError} from '/libs/dto';
import {CachingService, createRetryDecorator, getEnvironmentVariables, Logger} from '/libs/tools';

import {cryptoApiResponseSchema} from './crypto-api-client.schema';
import {weatherApiResponseSchema} from '../weather-api-client/weather-api-client.schema';

const cryptoApiClientCreator = (cachingService: CachingService, logger: Logger): CryptoClientInterface => {
  const [API_DATA_EXPIRATION_TIME] = getEnvironmentVariables(['API_DATA_EXPIRATION_TIME']);
  const EXPIRATION_TIME = parseInt(API_DATA_EXPIRATION_TIME, 10);
  const fetchCrypto = async (coin: string) => {
    const fetchWithRetry = createRetryDecorator(
      async () => {
        const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
        const response = await fetch(url);

        if (response.ok) {
          return await response.json();
        }

        if (response.status === 404) {
          throw new NotFoundError(`Coin ${coin} not found`);
        }

        throw new Error(`Crypto API error: ${response.statusText}`);
      },
      {
        maxRetries: 3,
      }
    );

    const data = await fetchWithRetry();

    if (!cryptoApiResponseSchema(data)) {
      logger.error('Crypto API response schema error', {data, errors: weatherApiResponseSchema.errors});
      throw new Error('Crypto API response schema error');
    }

    return {
      name: data.name,
      price_usd: data.market_data.current_price.usd,
    };
  };
  return {
    getCryptoPrices: async function (coin, forceRefresh) {
      if (forceRefresh) {
        const weatherData = await fetchCrypto(coin);
        await cachingService.set(coin.toLowerCase(), weatherData, EXPIRATION_TIME);
        return weatherData;
      }
      return await cachingService.getOrSet(
        coin.toLowerCase(),
        async () => {
          return await fetchCrypto(coin);
        },
        EXPIRATION_TIME
      );
    },
  };
};

export {cryptoApiClientCreator};
