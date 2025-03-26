import express, {Request, Response} from 'express';
import {body} from 'express-validator';

import {userCacheKeys} from '/apps/users/common/infrastructure/caching/cache-keys';
import {userRepositoryCreator} from '/apps/users/common/infrastructure/persistence/user-repository';
import {validateRequest} from '/config/infrastructure/middleware/validate-request';
import {cachingServiceCreator, passwordServiceCreator} from '/libs/tools';

import {registerUserCreator} from '../../application/useCases/register/register';

const router = express.Router();
const cachingService = cachingServiceCreator();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register
 *     description: New user registration
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/UserRegisterRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/api/v1/auth/register',
  [
    body('email').trim().normalizeEmail().isEmail().withMessage('Email must be valid'),
    body('name').trim().notEmpty().withMessage('Name should not be empty'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {email, name, password} = req.body;
    const useCase = registerUserCreator({
      userRepository: userRepositoryCreator(),
      passwordService: passwordServiceCreator(),
    });

    await useCase({email, name, password});
    await cachingService.invalidateByPattern(userCacheKeys.listPattern());
    res.status(201).send();
  }
);

export {router as registerRouter};
