import express, {Request, Response} from 'express';
import {param} from 'express-validator';

import {getUserProfileCreator} from 'apps/users/common/application/useCases/getUserProfile/getUserProfile';
import {userRepositoryCreator} from 'apps/users/common/infrastructure/persistence/user-repository';
import {requireRole, validateRequest} from 'config/infrastructure/middleware';
import {USER_ROLES} from 'libs/dto';
import {cachingServiceCreator} from 'libs/tools';
import {userCacheKeys} from 'apps/users/common/infrastructure/caching/cache-keys';

const router = express.Router();
const cachingService = cachingServiceCreator();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns single user information. Requires admin privileges.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
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
  '/api/v1/users/{:id}',
  [param('id').isString().notEmpty().isUUID().withMessage('User ID is required')],
  validateRequest,
  requireRole([USER_ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const cacheKey = userCacheKeys.single(userId);
    const user = await cachingService.getOrSet(cacheKey, async () => {
      const useCase = getUserProfileCreator({
        userRepository: userRepositoryCreator(),
      });
      return await useCase({id: userId});
    });

    res.status(200).send(user);
  }
);

export {router as getUserRouter};
