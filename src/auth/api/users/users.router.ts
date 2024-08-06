import express, { Router } from 'express';

import authorize from '../../middlewares/authorize';
import { registerAction } from '../../utils/register-permission-action';

import UsersController from './users.controller';

/**
 * Get routes for users API in the given Express application.
 */
export async function getUsersRouter(): Promise<Router> {
  const router: Router = express.Router();
  const usersController = new UsersController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/users/', authorize('users.getAllUsers'), usersController.getAllUsers);
  await registerAction('users.getAllUsers', 'Get all users');
  // ---------------------------------------------------------------------------
  router.get('/users/:id', authorize('users.getUserById'), usersController.getUserById);
  await registerAction('users.getUserById', 'Get a user');
  // ---------------------------------------------------------------------------
  router.post('/users/', authorize('users.createUser'), usersController.createUser);
  await registerAction('users.createUser', 'Create a user');
  // ---------------------------------------------------------------------------
  router.patch('/users/:id', authorize('users.updateUser'), usersController.updateUser);
  await registerAction('users.updateUser', 'Update a user');
  // ---------------------------------------------------------------------------
  router.delete('/users/:id', authorize('users.deleteUser'), usersController.deleteUser);
  await registerAction('users.deleteUser', 'Delete a user');
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
