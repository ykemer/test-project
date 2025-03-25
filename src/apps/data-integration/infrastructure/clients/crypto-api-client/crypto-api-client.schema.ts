import {CryptoApiResponse} from 'apps/data-integration/domain/clients/CryptoClient';
import {compileSchema2019, JSONSchemaType} from 'libs/tools';

const CRYPTO_API_RESPONSE_SCHEMA: JSONSchemaType<CryptoApiResponse> = {
  type: 'object',
  properties: {
    market_data: {
      type: 'object',
      required: ['current_price'],
      properties: {
        current_price: {
          type: 'object',
          properties: {
            usd: {
              type: 'number',
            },
          },
          required: ['usd'],
        },
      },
    },
    name: {
      type: 'string',
    },
  },
  required: ['market_data', 'name'],
};

const cryptoApiResponseSchema = compileSchema2019(CRYPTO_API_RESPONSE_SCHEMA);

export {cryptoApiResponseSchema};
