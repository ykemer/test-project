import express, {Request, Response} from 'express';
import {body} from 'express-validator';

import {validateRequest} from '/config/infrastructure/middleware/validate-request';

import {loginUserCreator} from 'apps/users/Auth/application/useCases/login/login';
import {userRepositoryCreator} from 'apps/users/common/infrastructure/persistence/user-repository';
import {jwtServiceCreator, passwordServiceCreator} from 'libs/tools';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/UserLoginRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTokenResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/api/v1/auth/login',
  [
    body('email').trim().normalizeEmail().isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must provide a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const useCase = loginUserCreator({
      userRepository: userRepositoryCreator(),
      passwordService: passwordServiceCreator(),
      jwtService: jwtServiceCreator(),
    });

    const result = await useCase({email, password});
    res.status(200).send(result);
  }
);

export {router as loginRouter};
