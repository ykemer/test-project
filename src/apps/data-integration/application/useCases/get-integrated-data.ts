import {CryptoClientInterface} from '/apps/data-integration/domain/clients/CryptoClient';
import {WeatherClientInterface} from '/apps/data-integration/domain/clients/WeatherClient';
import {IntegratedData} from '/apps/data-integration/domain/model/IntegratedData';

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
