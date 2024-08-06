import express, { Router } from 'express';

import { registerAction } from '../../utils/register-permission-action';

import PasswordResetController from './password-reset.controller';

/**
 * Get routes for auth API in the given Express application.
 */
export async function getPasswordResetRouter(): Promise<Router> {
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
  return router;
}
