import express, { Router } from 'express';

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
  // ---------------------------------------------------------------------------
  router.post('/reset-password', passwordResetController.resetPassword);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
