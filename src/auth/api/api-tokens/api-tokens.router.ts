import express, { Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

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
  router.get('/api-tokens/', authorize('apiTokens.getAllApiTokensOfUser'), apiTokensController.getAllApiTokensOfUser);
  await registerAction('apiTokens.getAllApiTokensOfUser', 'Get all apiTokens of user');
  // ---------------------------------------------------------------------------
  router.get('/api-tokens/:id', authorize('apiTokens.getApiTokenById'), apiTokensController.getApiTokenById);
  await registerAction('apiTokens.getApiTokenById', 'Get an apiToken');
  // ---------------------------------------------------------------------------
  router.post('/api-tokens/', authorize('apiTokens.issueToken'), apiTokensController.issueToken);
  await registerAction('apiTokens.issueToken', 'Issue an apiToken');
  // ---------------------------------------------------------------------------
  router.delete('/api-tokens/:id', authorize('apiTokens.revokeToken'), apiTokensController.revokeToken);
  await registerAction('apiTokens.revokeToken', 'Revoke an apiToken');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
