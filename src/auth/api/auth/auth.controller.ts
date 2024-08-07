import { NextFunction, Request, RequestHandler, Response } from 'express';

import { validateBody } from '../../../middlewares/validate-body.middleware';
import { Authorize } from '../../decorators/authorize.decorator';
import { UnauthenticatedError } from '../../errors/unauthenticated.error';

import AuthService from './auth.service';
import { LoginBodyDTO } from './dtos/login-body.dto';
import { RegisterBodyDTO } from './dtos/register-body.dto';

class AuthController {
  // ---------------------------------------------------------------------------
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // ---------------------------------------------------------------------------
  register: RequestHandler[] = [
    // Validate body
    validateBody(RegisterBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const authResponse = await this.authService.register(req.body);

      res.status(201).json(authResponse);
    },
  ];

  // ---------------------------------------------------------------------------
  login: RequestHandler[] = [
    // Validate body
    validateBody(LoginBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const authResponse = await this.authService.login(req.body);

      res.json(authResponse);
    },
  ];

  // ---------------------------------------------------------------------------
  // Because we are using the refresh token in this route, we'll handle token
  // verification manually in the handler and not the authorize middleware
  refresh: RequestHandler[] = [
    async (req: Request, res: Response) => {
      // Manually extract the refresh token from header
      const authHeader = req.headers['authorization'];
      if (!authHeader || typeof authHeader !== 'string') {
        throw new UnauthenticatedError();
      }

      const tokenParts = authHeader.split(' ');
      if (tokenParts.length !== 2 && tokenParts[0] !== 'Bearer') {
        throw new UnauthenticatedError();
      }

      const token = tokenParts[1];

      const authResponse = await this.authService.refresh(token);

      res.json(authResponse);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize() // Not passing permission action name will check ONLY for authentication
  me: RequestHandler[] = [
    async (req: Request, res: Response) => {
      const user = await this.authService.me(req.userId!);

      res.json(user);
    },
  ];

  // ---------------------------------------------------------------------------
}

export default AuthController;
