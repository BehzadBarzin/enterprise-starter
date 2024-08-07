import express, { Router } from 'express';

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
  router.get('/permissions/', permissionsController.getAllPermissions);
  // ---------------------------------------------------------------------------
  router.get('/permissions/:id', permissionsController.getPermissionById);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
