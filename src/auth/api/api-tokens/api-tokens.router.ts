import express, { Router } from 'express';

import ApiTokensController from './api-tokens.controller';

/**
 * Get routes for apiTokens API in the given Express application.
 */
export async function getApiTokensRouter(): Promise<Router> {
  const router: Router = express.Router();
  const apiTokensController = new ApiTokensController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/api-tokens/', apiTokensController.getAllApiTokensOfUser);
  // ---------------------------------------------------------------------------
  router.get('/api-tokens/:id', apiTokensController.getApiTokenById);
  // ---------------------------------------------------------------------------
  router.post('/api-tokens/', apiTokensController.issueToken);
  // ---------------------------------------------------------------------------
  router.delete('/api-tokens/:id', apiTokensController.revokeToken);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
