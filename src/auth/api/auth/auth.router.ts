import express, { Router } from 'express';

import AuthController from './auth.controller';

/**
 * Get routes for auth API in the given Express application.
 */
export async function getAuthRouter(): Promise<Router> {
  const router: Router = express.Router();
  const authController = new AuthController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.post('/register', authController.register);
  // ---------------------------------------------------------------------------
  router.post('/login', authController.login);
  // ---------------------------------------------------------------------------
  router.get('/refresh', authController.refresh);
  // ---------------------------------------------------------------------------
  router.get('/me', authController.me);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
