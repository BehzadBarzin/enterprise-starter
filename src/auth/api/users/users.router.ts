import express, { Application, Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import UsersController from './users.controller';

/**
 * Registers routes for users API in the given Express application.
 *
 * @param app - The Express application instance.
 */
export async function registerUsersRouter(app: Application): Promise<void> {
  const router: Router = express.Router();
  const usersController = new UsersController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/', authorize('users.getAllUsers'), usersController.getAllUsers);
  await registerAction('users.getAllUsers', 'Get all users');
  // ---------------------------------------------------------------------------
  router.get('/:id', authorize('users.getUserById'), usersController.getUserById);
  await registerAction('users.getUserById', 'Get a user');
  // ---------------------------------------------------------------------------
  router.post('/', authorize('users.createUser'), usersController.createUser);
  await registerAction('users.createUser', 'Create a user');
  // ---------------------------------------------------------------------------
  router.patch('/:id', authorize('users.updateUser'), usersController.updateUser);
  await registerAction('users.updateUser', 'Update a user');
  // ---------------------------------------------------------------------------
  router.delete('/:id', authorize('users.deleteUser'), usersController.deleteUser);
  await registerAction('users.deleteUser', 'Delete a user');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  app.use('/users', router);
}
