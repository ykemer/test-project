import express, {Request, Response} from 'express';
import {body, param, matchedData} from 'express-validator';

import {updateUserCreator} from '/apps/users/Users/application/useCases/updateUser/update-user';
import {invalidateUserCache} from '/apps/users/common/infrastructure/caching/cache-helper';
import {userRepositoryCreator} from '/apps/users/common/infrastructure/persistence/user-repository';
import {requireRole} from '/config/infrastructure/middleware';
import {validateRequest} from '/config/infrastructure/middleware/validate-request';
import {USER_ROLES} from '/libs/dto';
import {cachingServiceCreator, passwordServiceCreator} from '/libs/tools';

const router = express.Router();
const cachingService = cachingServiceCreator();
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user by ID
 *     description: Updates user information. Requires admin privileges.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/api/v1/users/:id',
  [
    param('id').isString().notEmpty().isUUID().withMessage('User ID is required'),
    body('name').optional().isString().trim().notEmpty().withMessage('Name must be a non-empty string'),
    body('password')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .isLength({min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters'),
    body('role').optional().isIn(Object.values(USER_ROLES)).withMessage('Role must be valid'),
  ],
  validateRequest,
  requireRole([USER_ROLES.ADMIN]),
  async (req: Request, res: Response) => {
    const {id} = req.params;
    const validatedData = matchedData(req, {locations: ['body']});

    const useCase = updateUserCreator({
      userRepository: userRepositoryCreator(),
      passwordService: passwordServiceCreator(),
    });

    await useCase({
      id,
      updates: validatedData,
    });

    await invalidateUserCache(req.params.id, cachingService);
    res.status(200).send();
  }
);

export {router as updateUserRouter};
