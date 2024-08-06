import express, { Application, Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import PasswordResetController from './password-reset.controller';

/**
 * Registers routes for auth API in the given Express application.
 *
 * @param app - The Express application instance.
 */
export async function registerPasswordResetRouter(app: Application): Promise<void> {
  const router: Router = express.Router();
  const passwordResetController = new PasswordResetController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.post('/forgot-password', passwordResetController.forgotPassword);
  await registerAction('auth.forgot-password', 'Send password reset link');
  // ---------------------------------------------------------------------------
  router.post('/reset-password', passwordResetController.resetPassword);
  await registerAction('auth.reset-password', 'Reset password');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  app.use('/auth', router);
}
