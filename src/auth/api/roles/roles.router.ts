import express, { Application, Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import RolesController from './roles.controller';

/**
 * Registers routes for roles API in the given Express application.
 *
 * @param app - The Express application instance.
 */
export async function registerRolesRouter(app: Application): Promise<void> {
  const router: Router = express.Router();
  const rolesController = new RolesController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/', authorize('roles.getAllRoles'), rolesController.getAllRoles);
  await registerAction('roles.getAllRoles', 'Get all roles');
  // ---------------------------------------------------------------------------
  router.get('/:id', authorize('roles.getRoleById'), rolesController.getRoleById);
  await registerAction('roles.getRoleById', 'Get a role');
  // ---------------------------------------------------------------------------
  router.post('/', authorize('roles.createRole'), rolesController.createRole);
  await registerAction('roles.createRole', 'Create a role');
  // ---------------------------------------------------------------------------
  router.patch('/:id', authorize('roles.updateRole'), rolesController.updateRole);
  await registerAction('roles.updateRole', 'Update a role');
  // ---------------------------------------------------------------------------
  router.delete('/:id', authorize('roles.deleteRole'), rolesController.deleteRole);
  await registerAction('roles.deleteRole', 'Delete a role');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  app.use('/auth/roles', router);
}
