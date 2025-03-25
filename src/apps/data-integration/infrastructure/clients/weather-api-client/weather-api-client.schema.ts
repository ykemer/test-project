import {WeatherAPIResponse} from 'apps/data-integration/domain/clients/WeatherClient';
import {compileSchema2019, JSONSchemaType} from 'libs/tools';

const WEATHER_API_RESPONSE_SCHEMA: JSONSchemaType<WeatherAPIResponse> = {
  type: 'object',
  properties: {
    main: {
      type: 'object',
      properties: {
        temp: {type: 'number'},
      },
      required: ['temp'],
    },
    weather: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: {type: 'string'},
        },
        required: ['description'],
      },
    },
    name: {type: 'string'},
  },
  required: ['main', 'weather', 'name'],
  additionalProperties: false,
};

const weatherApiResponseSchema = compileSchema2019(WEATHER_API_RESPONSE_SCHEMA);

export {weatherApiResponseSchema};
