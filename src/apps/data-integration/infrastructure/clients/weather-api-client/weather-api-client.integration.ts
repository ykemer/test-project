import {weatherApiClientCreator} from 'apps/data-integration/infrastructure/clients/weather-api-client/weather-api-client';

import {WeatherClientInterface} from 'apps/data-integration/domain/clients/WeatherClient';
import {CachingService, Logger} from 'libs/tools';

describe('Weather API Client Integration Tests', () => {
  let weatherClient: WeatherClientInterface;
  let mockCachingService: Partial<CachingService>;
  let mockLogger: Partial<Logger>;
  let fetchSpy: jest.SpyInstance;

  const mockWeatherResponse = {
    name: 'London',
    main: {
      temp: 15.5,
    },
    weather: [
      {
        description: 'scattered clouds',
      },
    ],
  };

  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherResponse),
      })
    ) as jest.Mock;
    fetchSpy = jest.spyOn(global, 'fetch');

    // Mock cache service with proper generic type handling
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
      warning: jest.fn(),
    };

    // Set up environment variables
    process.env.WEATHER_API_KEY = 'test_api_key';
    process.env.API_DATA_EXPIRATION_TIME = '3600';

    // Create client with mocks
    weatherClient = weatherApiClientCreator(mockCachingService as CachingService, mockLogger as Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.WEATHER_API_KEY;
    delete process.env.API_DATA_EXPIRATION_TIME;
  });

  test('getWeather returns formatted data', async () => {
    const result = await weatherClient.getWeather('London', false);

    expect(result).toEqual({
      city: 'London',
      temperature: '16°C', // Rounded from 15.5
      weather: 'scattered clouds',
    });

    const expectedUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=test_api_key&units=metric';
    expect(fetchSpy).toHaveBeenCalledWith(expectedUrl);
  });

  test('getWeather with forceRefresh=true bypasses cache', async () => {
    await weatherClient.getWeather('London', true);

    expect(mockCachingService.set).toHaveBeenCalled();
    expect(mockCachingService.getOrSet).not.toHaveBeenCalled();
  });

  test('getWeather with forceRefresh=false uses cache', async () => {
    await weatherClient.getWeather('London', false);

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

    await expect(weatherClient.getWeather('NonexistentCity', false)).rejects.toThrow('City NonexistentCity not found');
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
        json: () => Promise.resolve(mockWeatherResponse),
      });
    }) as jest.Mock;

    const result = await weatherClient.getWeather('London', false);

    expect(attempts).toBe(3);
    expect(result).toEqual({
      city: 'London',
      temperature: '16°C',
      weather: 'scattered clouds',
    });
  });
});
