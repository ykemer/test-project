import {CryptoClientInterface} from '../../domain/clients/crypto-client-interface';
import {WeatherClientInterface} from '../../domain/clients/weather-client-interface';
import {IntegratedData} from '../../domain/model/integrated-data';

type GetIntegratedDataDependencies = {
  weatherClient: WeatherClientInterface;
  cryptoClient: CryptoClientInterface;
};

type GetIntegratedDataRequest = {
  city: string;
  currency: string;
  refresh?: boolean;
};

type GetIntegratedDataResponse = IntegratedData;

const getIntegratedDataCreator =
  ({weatherClient, cryptoClient}: GetIntegratedDataDependencies) =>
  async ({city, currency, refresh}: GetIntegratedDataRequest): Promise<GetIntegratedDataResponse> => {
    const [weatherData, cryptoData] = await Promise.all([
      weatherClient.getWeather(city, refresh),
      cryptoClient.getCryptoPrices(currency, refresh),
    ]);

    return {
      city: weatherData.city,
      temperature: weatherData.temperature,
      weather: weatherData.weather,
      crypto: cryptoData,
    };
  };

export {getIntegratedDataCreator};
