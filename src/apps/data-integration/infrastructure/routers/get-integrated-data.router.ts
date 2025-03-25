import {Router, Request, Response} from 'express';
import {matchedData, query} from 'express-validator';

import {getIntegratedDataCreator} from 'apps/data-integration/application/useCases/get-integrated-data';
import {cryptoApiClientCreator} from 'apps/data-integration/infrastructure/clients/crypto-api-client/crypto-api-client';
import {weatherApiClientCreator} from 'apps/data-integration/infrastructure/clients/weather-api-client/weather-api-client';
import {requireAuth, validateRequest} from 'config/infrastructure/middleware';
import {cachingServiceCreator, getLogger} from 'libs/tools';

const router = Router();
const logger = getLogger();
const cachingService = cachingServiceCreator();
const weatherApiClient = weatherApiClientCreator(cachingService, logger);
const cryptoApiClient = cryptoApiClientCreator(cachingService, logger);

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Get integrated weather and crypto data
 *     security:
 *       - bearerAuth: []
 *     tags: [Data Integration]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: City name for weather data
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         required: true
 *         description: Cryptocurrency name (e.g., bitcoin)
 *       - in: query
 *         name: refresh
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Force refresh cached data
 *     responses:
 *       200:
 *         description: Integrated data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IntegratedDataResponse'
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get(
  '/api/v1/data',
  requireAuth,
  [query('city').exists().isString(), query('currency').exists().isString(), query('refresh').optional().isBoolean()],
  validateRequest,
  async (req: Request, res: Response) => {
    const useCase = getIntegratedDataCreator({
      weatherClient: weatherApiClient,
      cryptoClient: cryptoApiClient,
    });

    const {city, currency, refresh} = matchedData(req, {locations: ['query']});
    const data = await useCase({city, currency, refresh});
    res.status(200).json(data);
  }
);

export {router as integratedDataRouter};
