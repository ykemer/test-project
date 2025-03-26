import express, {Request, Response} from 'express';


import {getUserProfileCreator} from 'apps/users/common/application/useCases/getUserProfile/getUserProfile';
import {userRepositoryCreator} from 'apps/users/common/infrastructure/persistence/user-repository';
import {requireAuth} from 'config/infrastructure/middleware/require-auth';

const router = express.Router();

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Profile
 *     description: Get user profile
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/api/v1/auth/profile', requireAuth, async (req: Request, res: Response) => {
  const useCase = getUserProfileCreator({userRepository: userRepositoryCreator()});
  const user = await useCase({id: req.currentUser!.id});
  res.status(200).send(user);
});

export {router as profileRouter};
