import {WeatherData} from 'apps/data-integration/domain/model/WeatherData';

type WeatherClientInterface = {
  getWeather(city: string, forceRefresh?: boolean): Promise<WeatherData>;
};

type WeatherAPIResponse = {
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
  name: string;
};

export type {WeatherAPIResponse, WeatherClientInterface};
