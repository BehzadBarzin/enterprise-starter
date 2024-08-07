import { Request, RequestHandler, Response } from 'express';

import { IdParamsDTO } from '../../../common/dtos/id-params.dto';
import { validateBody } from '../../../middlewares/validate-body.middleware';
import { validateParams } from '../../../middlewares/validate-params.middleware';
import { Authorize } from '../../decorators/authorize.decorator';

import { CreateUserBodyDTO } from './dtos/create-user-body.dto';
import { UpdateUserBodyDTO } from './dtos/update-user-body.dto';
import UsersService from './users.service';

class UsersController {
  // -------------------------------------------------------------------------
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  // ---------------------------------------------------------------------------
  @Authorize('users.getAllUsers')
  getAllUsers: RequestHandler[] = [
    async (req: Request, res: Response) => {
      const users = await this.usersService.getAllUsers();

      res.json(users);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('users.getUserById')
  getUserById: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const user = await this.usersService.getUserById(parseInt(id, 10));
      res.json(user);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('users.createUser')
  createUser: RequestHandler[] = [
    // Validate body
    validateBody(CreateUserBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const newUser = await this.usersService.createUser(req.body);

      res.status(201).json(newUser);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('users.updateUser')
  updateUser: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Validate body
    validateBody(UpdateUserBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const updatedUser = await this.usersService.updateUser(parseInt(id, 10), req.body);

      res.json(updatedUser);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('users.deleteUser')
  deleteUser: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const deletedUser = await this.usersService.deleteUser(parseInt(id, 10));

      res.json(deletedUser);
    },
  ];

  // ---------------------------------------------------------------------------
}

export default UsersController;
