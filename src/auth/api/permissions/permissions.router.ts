import express, { Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import PermissionsController from './permissions.controller';

/**
 * Get routes for permissions API in the given Express application.
 */
export async function getPermissionsRouter(): Promise<Router> {
  const router: Router = express.Router();
  const permissionsController = new PermissionsController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/permissions/', authorize('permissions.getAllPermissions'), permissionsController.getAllPermissions);
  await registerAction('permissions.getAllPermissions', 'Get all permissions');
  // ---------------------------------------------------------------------------
  router.get('/permissions/:id', authorize('permissions.getPermissionById'), permissionsController.getPermissionById);
  await registerAction('permissions.getPermissionById', 'Get a permission');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
