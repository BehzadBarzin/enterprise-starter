import express, { Application, Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import ApiTokensController from './api-tokens.controller';

/**
 * Registers routes for apiTokens API in the given Express application.
 *
 * @param app - The Express application instance.
 */
export async function registerApiTokensRouter(app: Application): Promise<void> {
  const router: Router = express.Router();
  const apiTokensController = new ApiTokensController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/', authorize('apiTokens.getAllApiTokensOfUser'), apiTokensController.getAllApiTokensOfUser);
  await registerAction('apiTokens.getAllApiTokensOfUser', 'Get all apiTokens of user');
  // ---------------------------------------------------------------------------
  router.get('/:id', authorize('apiTokens.getApiTokenById'), apiTokensController.getApiTokenById);
  await registerAction('apiTokens.getApiTokenById', 'Get an apiToken');
  // ---------------------------------------------------------------------------
  router.post('/', authorize('apiTokens.issueToken'), apiTokensController.issueToken);
  await registerAction('apiTokens.issueToken', 'Issue an apiToken');
  // ---------------------------------------------------------------------------
  router.delete('/:id', authorize('apiTokens.revokeToken'), apiTokensController.revokeToken);
  await registerAction('apiTokens.revokeToken', 'Revoke an apiToken');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  app.use('/auth/api-tokens', router);
}
