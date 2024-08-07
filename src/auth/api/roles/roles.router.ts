import express, { Router } from 'express';

import RolesController from './roles.controller';

/**
 * Get routes for roles API in the given Express application.
 */
export async function getRolesRouter(): Promise<Router> {
  const router: Router = express.Router();
  const rolesController = new RolesController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/roles/', rolesController.getAllRoles);
  // ---------------------------------------------------------------------------
  router.get('/roles/:id', rolesController.getRoleById);
  // ---------------------------------------------------------------------------
  router.post('/roles/', rolesController.createRole);
  // ---------------------------------------------------------------------------
  router.patch('/roles/:id', rolesController.updateRole);
  // ---------------------------------------------------------------------------
  router.delete('/roles/:id', rolesController.deleteRole);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
