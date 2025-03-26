import {cryptoApiClientCreator} from 'apps/data-integration/infrastructure/clients/crypto-api-client/crypto-api-client';

import {CryptoClientInterface} from 'apps/data-integration/domain/clients/CryptoClient';
import {CachingService, Logger} from 'libs/tools';

describe('Crypto API Client Integration Tests', () => {
  let cryptoClient: CryptoClientInterface;
  let mockCachingService: Partial<CachingService>;
  let mockLogger: Partial<Logger>;
  let fetchSpy: jest.SpyInstance;

  const mockCryptoResponse = {
    name: 'Bitcoin',
    market_data: {
      current_price: {
        usd: 50000,
      },
    },
  };

  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCryptoResponse),
      })
    ) as jest.Mock;
    fetchSpy = jest.spyOn(global, 'fetch');

    // Mock cache service
    mockCachingService = {
      set: jest.fn(),
      getOrSet: jest.fn().mockImplementation(<T>(_key: string, fetchFn: () => Promise<T>) => {
        return fetchFn();
      }),
    };

    // Mock logger
    mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    // Create client with mocks
    process.env.API_DATA_EXPIRATION_TIME = '3600';
    cryptoClient = cryptoApiClientCreator(mockCachingService as CachingService, mockLogger as Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getCryptoPrices returns formatted data', async () => {
    const result = await cryptoClient.getCryptoPrices('bitcoin', false);

    expect(result).toEqual({
      name: 'Bitcoin',
      price_usd: 50000,
    });
    expect(fetchSpy).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/coins/bitcoin');
  });

  test('getCryptoPrices with forceRefresh=true bypasses cache', async () => {
    await cryptoClient.getCryptoPrices('bitcoin', true);

    expect(mockCachingService.set).toHaveBeenCalled();
    expect(mockCachingService.getOrSet).not.toHaveBeenCalled();
  });

  test('getCryptoPrices with forceRefresh=false uses cache', async () => {
    await cryptoClient.getCryptoPrices('bitcoin', false);

    expect(mockCachingService.getOrSet).toHaveBeenCalled();
    expect(mockCachingService.set).not.toHaveBeenCalled();
  });

  test('handles 404 API response correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
    ) as jest.Mock;

    await expect(cryptoClient.getCryptoPrices('nonexistentcoin', false)).rejects.toThrow(
      'Coin nonexistentcoin not found'
    );
  });

  test('retries on API failure', async () => {
    let attempts = 0;
    global.fetch = jest.fn(() => {
      attempts++;
      if (attempts < 3) {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Server Error',
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCryptoResponse),
      });
    }) as jest.Mock;

    const result = await cryptoClient.getCryptoPrices('bitcoin', false);

    expect(attempts).toBe(3);
    expect(result).toEqual({
      name: 'Bitcoin',
      price_usd: 50000,
    });
  });
});
