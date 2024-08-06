import express, { Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

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
  router.get('/roles/', authorize('roles.getAllRoles'), rolesController.getAllRoles);
  await registerAction('roles.getAllRoles', 'Get all roles');
  // ---------------------------------------------------------------------------
  router.get('/roles/:id', authorize('roles.getRoleById'), rolesController.getRoleById);
  await registerAction('roles.getRoleById', 'Get a role');
  // ---------------------------------------------------------------------------
  router.post('/roles/', authorize('roles.createRole'), rolesController.createRole);
  await registerAction('roles.createRole', 'Create a role');
  // ---------------------------------------------------------------------------
  router.patch('/roles/:id', authorize('roles.updateRole'), rolesController.updateRole);
  await registerAction('roles.updateRole', 'Update a role');
  // ---------------------------------------------------------------------------
  router.delete('/roles/:id', authorize('roles.deleteRole'), rolesController.deleteRole);
  await registerAction('roles.deleteRole', 'Delete a role');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
