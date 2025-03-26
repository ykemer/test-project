import express, {Request, Response} from 'express';
import {param} from 'express-validator';

import {deleteUserCreator} from '/apps/users/Users/application/useCases/deleteUser/deleteUser';
import {invalidateUserCache} from '/apps/users/common/infrastructure/caching/cache-helper';
import {userRepositoryCreator} from '/apps/users/common/infrastructure/persistence/user-repository';
import {requireRole, validateRequest} from '/config/infrastructure/middleware';
import {USER_ROLES} from '/libs/dto';
import {cachingServiceCreator} from '/libs/tools';

const router = express.Router();
const cachingService = cachingServiceCreator();

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Deletes user. Requires admin privileges.
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
 *       204:
 *         description: Deleted user
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.delete(
  '/api/v1/users/{:id}',
  [param('id').isString().notEmpty().isUUID().withMessage('User ID is required')],
  validateRequest,
  requireRole([USER_ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    const useCase = deleteUserCreator({
      userRepository: userRepositoryCreator(),
    });

    await useCase({id: req.params.id});
    await invalidateUserCache(req.params.id, cachingService);
    res.status(204).send();
  }
);

export {router as deleteUserRouter};
