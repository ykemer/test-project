import {WeatherClientInterface} from '../../../domain/clients/weather-client-interface';
import {WeatherData} from '../../../domain/model/weather-data';

const weatherApiClientInMemoryCreator = (): WeatherClientInterface & {
  output: WeatherData | undefined;
  givenValidOutput: (output: WeatherData) => void;
  reset: () => void;
} => {
  return {
    output: undefined,
    reset: function () {
      this.output = undefined;
    },
    givenValidOutput: function (output) {
      this.output = output;
    },
    getWeather: async function () {
      if (!this.output) {
        throw new Error('City not found');
      }
      return Promise.resolve(this.output);
    },
  };
};

export {weatherApiClientInMemoryCreator};
