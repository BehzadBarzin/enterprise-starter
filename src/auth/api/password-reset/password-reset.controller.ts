import { Request, RequestHandler, Response } from 'express';

import { validateBody } from '../../../middlewares/validate-body.middleware';

import { ForgotPasswordBodyDTO } from './dtos/forgot-password-body.dto';
import { ResetPasswordBodyDTO } from './dtos/reset-password-body.dto';
import PasswordResetService from './password-reset.service';

class PasswordResetController {
  // ---------------------------------------------------------------------------
  private passwordResetService: PasswordResetService;

  constructor() {
    this.passwordResetService = new PasswordResetService();
  }

  // ---------------------------------------------------------------------------
  forgotPassword: RequestHandler[] = [
    // Validate body
    validateBody(ForgotPasswordBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      await this.passwordResetService.sendPasswordResetToken(req.body);

      res.json({
        message: 'Password reset link was sent to your email',
      });
    },
  ];

  // ---------------------------------------------------------------------------
  resetPassword: RequestHandler[] = [
    // Validate body
    validateBody(ResetPasswordBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const user = await this.passwordResetService.resetPassword(req.body);

      res.json(user);
    },
  ];

  // ---------------------------------------------------------------------------
}

export default PasswordResetController;
