import {WeatherClientInterface} from 'apps/data-integration/domain/clients/WeatherClient';
import {WeatherData} from 'apps/data-integration/domain/model/WeatherData';

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
