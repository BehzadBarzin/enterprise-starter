import { User } from '@prisma/client';
import ms from 'ms';

import { BadRequestError } from '../../../errors/bad-request.error';
import { logger } from '../../../utils/logger';
import { prisma } from '../../../utils/prisma';
import { generateHash } from '../../utils/password';
import { generateToken } from '../../utils/token';
import UsersService, { CleanUser } from '../users/users.service';

import { ForgotPasswordBodyDTO } from './dtos/forgot-password-body.dto';
import { ResetPasswordBodyDTO } from './dtos/reset-password-body.dto';

class PasswordResetService {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  // ---------------------------------------------------------------------------
  async sendPasswordResetToken(forgotPasswordData: ForgotPasswordBodyDTO): Promise<void> {
    const { email } = forgotPasswordData;

    // Using try-catch because user service throws a 404 error if user isn't found
    // and we don't want to send the 404 to let the user know that the email was incorrect
    let user: User | null = null;
    try {
      // Get user from user service including password
      user = (await this.usersService.getUserByEmail(email, true)) as User;
    } catch (error) {}

    if (!user) {
      // If the user isn't found, we'll return normally
      // we don't want the user to know if the email was correct or not
      return;
    }

    // Delete all previous tokens
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Generate a random token
    const token = generateToken();

    const expiresAt = new Date().getTime() + ms(process.env.PASSWORD_RESET_TOKEN_EXPIRATION_TIME!);

    const newToken = await prisma.passwordResetToken.create({
      data: {
        token: token,
        expiration: new Date(expiresAt),
        user: { connect: { id: user.id } },
      },
    });

    // Todo: Link must come from env
    const link = `http://localhost:${process.env.PORT}/reset-password-page?token=${newToken.token}`;

    // Todo: Send link to email of the user

    logger.debug(`Password Reset Link`, link, newToken.token);
  }

  // ---------------------------------------------------------------------------
  async resetPassword(resetPasswordData: ResetPasswordBodyDTO): Promise<CleanUser> {
    const { token, password } = resetPasswordData;

    // Find PasswordResetToken entity from DB and populate its user
    const tokenEntity = await prisma.passwordResetToken.findFirst({
      where: { token: token },
      include: { user: true },
    });

    if (!tokenEntity) {
      throw new BadRequestError('Invalid Token');
    }

    // If token is expired
    if (tokenEntity.expiration < new Date()) {
      // Delete Token from DB
      await prisma.passwordResetToken.delete({
        where: { id: tokenEntity.id },
      });

      throw new BadRequestError('Token Expired');
    }

    // Check if user exists
    const user = await this.usersService.getUserById(tokenEntity.user.id);
    if (!user) {
      throw new BadRequestError('Invalid Token');
    }

    // Update user's password
    const newPassword = await generateHash(password);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
      },
    });

    // Delete All Tokens from DB belonging to this user
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    return this.usersService.cleanUser(updatedUser);
  }

  // ---------------------------------------------------------------------------
}

export default PasswordResetService;
