import express, { Application, Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import PermissionsController from './permissions.controller';

/**
 * Registers routes for permissions API in the given Express application.
 *
 * @param app - The Express application instance.
 */
export async function registerPermissionsRouter(app: Application): Promise<void> {
  const router: Router = express.Router();
  const permissionsController = new PermissionsController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/', authorize('permissions.getAllPermissions'), permissionsController.getAllPermissions);
  await registerAction('permissions.getAllPermissions', 'Get all permissions');
  // ---------------------------------------------------------------------------
  router.get('/:id', authorize('permissions.getPermissionById'), permissionsController.getPermissionById);
  await registerAction('permissions.getPermissionById', 'Get a permission');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  app.use('/auth/permissions', router);
}
