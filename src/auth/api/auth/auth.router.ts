import express, { Application, Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import AuthController from './auth.controller';

/**
 * Registers routes for auth API in the given Express application.
 *
 * @param app - The Express application instance.
 */
export async function registerAuthRouter(app: Application): Promise<void> {
  const router: Router = express.Router();
  const authController = new AuthController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.post('/register', authController.register);
  await registerAction('auth.register', 'Register a user');
  // ---------------------------------------------------------------------------
  router.post('/login', authController.login);
  await registerAction('auth.login', 'Login as user');
  // ---------------------------------------------------------------------------
  // Because we are using the refresh token in this route, we'll handle token verification manually in the handler
  router.get('/refresh', authController.refresh);
  await registerAction('auth.refresh', 'Refresh the access token');
  // ---------------------------------------------------------------------------
  // using 'authorize' middleware without action id, this tells it to just perform authentication
  router.get('/me', authorize(), authController.me);
  await registerAction('auth.me', 'Get me');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  app.use('/auth', router);
}
