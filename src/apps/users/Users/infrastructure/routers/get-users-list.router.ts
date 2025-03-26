import express, {Request, Response} from 'express';
import {matchedData, query} from 'express-validator';


import {listUsersCreator} from 'apps/users/Users/application/useCases/listUsers/list-users';
import {userCacheKeys} from 'apps/users/common/infrastructure/caching/cache-keys';
import {userRepositoryCreator} from 'apps/users/common/infrastructure/persistence/user-repository';
import {requireRole} from 'config/infrastructure/middleware';
import {validateRequest} from 'config/infrastructure/middleware/validate-request';
import {BadRequestError, USER_ROLES} from 'libs/dto';
import {cachingServiceCreator, isNumber} from 'libs/tools';

const router = express.Router();
const cachingService = cachingServiceCreator();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of users
 *     description: Returns a paginated list of users. Requires admin privileges.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 10
 *         description: Number of items per page (max 10)
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/api/v1/users',
  [
    query('page').default(1).isInt({min: 1}).toInt().withMessage('page must be a number greater than 0'),
    query('pageSize').default(10).isInt({min: 1, max: 10}).toInt().withMessage('page size must be between 1 and 10'),
  ],
  validateRequest,
  requireRole([USER_ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    const {page, pageSize} = matchedData(req, {locations: ['query']});

    if (!isNumber(page) || !isNumber(pageSize)) {
      throw new BadRequestError('Invalid page or pageSize');
    }

    const cacheKey = userCacheKeys.list(page, pageSize);
    const result = await cachingService.getOrSet(cacheKey, async () => {
      const useCase = listUsersCreator({
        userRepository: userRepositoryCreator(),
      });
      return await useCase({page, pageSize});
    });

    res.status(200).send(result);
  }
);

export {router as listUsersRouter};
