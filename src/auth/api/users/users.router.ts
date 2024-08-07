import express, { Router } from 'express';

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
  router.get('/users/', usersController.getAllUsers);
  // ---------------------------------------------------------------------------
  router.get('/users/:id', usersController.getUserById);
  // ---------------------------------------------------------------------------
  router.post('/users/', usersController.createUser);
  // ---------------------------------------------------------------------------
  router.patch('/users/:id', usersController.updateUser);
  // ---------------------------------------------------------------------------
  router.delete('/users/:id', usersController.deleteUser);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
