import {WeatherClientInterface} from 'apps/data-integration/domain/clients/WeatherClient';
import {weatherApiResponseSchema} from 'apps/data-integration/infrastructure/clients/weather-api-client/weather-api-client.schema';
import {NotFoundError} from 'libs/dto';
import {CachingService, createRetryDecorator, getEnvironmentVariables, Logger} from 'libs/tools';

const weatherApiClientCreator = (cachingService: CachingService, logger: Logger): WeatherClientInterface => {
  const [WEATHER_API_KEY, API_DATA_EXPIRATION_TIME] = getEnvironmentVariables([
    'WEATHER_API_KEY',
    'API_DATA_EXPIRATION_TIME',
  ]);
  const EXPIRATION_TIME = parseInt(API_DATA_EXPIRATION_TIME, 10);
  const fetchWeather = async (city: string) => {
    const fetchWithRetry = createRetryDecorator(
      async () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
        const response = await fetch(url);

        if (response.ok) {
          return await response.json();
        }

        if (response.status === 404) {
          throw new NotFoundError(`City ${city} not found`);
        }

        throw new Error(`Weather API error: ${response.statusText}`);
      },
      {
        maxRetries: 3,
      }
    );

    const data = await fetchWithRetry();

    if (!weatherApiResponseSchema(data)) {
      logger.error('Weather API response schema error', {data, errors: weatherApiResponseSchema.errors});
      throw new Error('Weather API response schema error');
    }

    return {
      city: data.name,
      temperature: `${Math.round(data.main.temp)}°C`,
      weather: data.weather[0].description,
    };
  };
  return {
    getWeather: async function (city, forceRefresh) {
      if (forceRefresh) {
        const weatherData = await fetchWeather(city);
        await cachingService.set(city.toLowerCase(), weatherData, EXPIRATION_TIME);
        return weatherData;
      }
      return await cachingService.getOrSet(
        city.toLowerCase(),
        async () => {
          return await fetchWeather(city);
        },
        EXPIRATION_TIME
      );
    },
  };
};

export {weatherApiClientCreator};
