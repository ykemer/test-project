import express, { Request, Response } from 'express';
import { param } from 'express-validator';

import { deleteUserCreator } from '../../application/usecases/delete-user/delete-user';
import { invalidateUserCache } from '/apps/users/common/infrastructure/caching/cache-helper';
import { userRepositoryCreator } from '/apps/users/common/infrastructure/persistence/user-repository';
import { requireRole, validateRequest } from '/config/infrastructure/middleware';
import { USER_ROLES } from '/libs/dto';
import { cachingServiceCreator } from '/libs/tools';

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
  '/api/v1/users/:id',
  [param('id').isString().notEmpty().isUUID().withMessage('User ID is required')],
  validateRequest,
  requireRole([USER_ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const useCase = deleteUserCreator({
      userRepository: userRepositoryCreator(),
    });

    await useCase({id});
    await invalidateUserCache(id, cachingService);
    res.status(204).send();
  }
);

export {router as deleteUserRouter};
