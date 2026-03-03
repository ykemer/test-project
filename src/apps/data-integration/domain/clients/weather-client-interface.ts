import {WeatherData} from '../model/weather-data';

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
