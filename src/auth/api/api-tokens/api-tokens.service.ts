import { ApiToken } from '@prisma/client';

import { NotFoundError } from '../../../errors/not-found.error';
import { prisma } from '../../../utils/prisma';
import { ForbiddenError } from '../../errors/forbidden.error';
import { generateToken } from '../../utils/token';

import { IssueTokenBodyDTO } from './dtos/issue-token-body.dto';

class ApiTokensService {
  // ---------------------------------------------------------------------------
  async getAllApiTokensOfUser(userId: number): Promise<ApiToken[]> {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
    if (!user) {
      throw new NotFoundError('User Not Found');
    }

    const isSuperAdmin: boolean = user.roles.some((role) => role.name === 'super-admin');
    if (!isSuperAdmin) {
      throw new ForbiddenError();
    }

    const apiTokens = await prisma.apiToken.findMany({
      where: { user: { id: user.id } },
    });

    // Return obscured api tokens
    return apiTokens.map((apiToken) => this.obscureToken(apiToken));
  }

  // ---------------------------------------------------------------------------
  async getApiTokenById(id: number): Promise<ApiToken> {
    const apiToken = await prisma.apiToken.findUnique({ where: { id } });
    if (!apiToken) {
      throw new NotFoundError('ApiToken Not Found');
    }

    return this.obscureToken(apiToken);
  }

  // ---------------------------------------------------------------------------
  async issueToken(userId: number, apiTokenData: IssueTokenBodyDTO): Promise<ApiToken> {
    // Get user from DB
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
    if (!user) {
      throw new NotFoundError('User Not Found');
    }

    const isSuperAdmin: boolean = user.roles.some((role) => role.name === 'super-admin');
    if (!isSuperAdmin) {
      throw new ForbiddenError();
    }

    // Generate a random token
    const token = generateToken(256);

    const newToken = await prisma.apiToken.create({
      data: {
        ...apiTokenData,
        token: token,
        user: { connect: { id: user.id } },
      },
    });

    return newToken;
  }

  // ---------------------------------------------------------------------------
  async revokeToken(id: number): Promise<ApiToken> {
    const apiTokenToDelete = await prisma.apiToken.findFirst({ where: { id } });
    if (!apiTokenToDelete) {
      throw new NotFoundError('ApiToken Not Found');
    }

    const deletedApiToken = await prisma.apiToken.delete({
      where: { id },
    });

    return this.obscureToken(deletedApiToken);
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  /**
   * Utility function to obscure the token field of the ApiToken DB entity
   * It replaces the token field characters with '*' except for the first 4 and last 4 characters
   */
  obscureToken(apiToken: ApiToken): ApiToken {
    const obscuredToken = apiToken.token.slice(0, 3) + '*'.repeat(apiToken.token.length - 8) + apiToken.token.slice(-4);
    return {
      ...apiToken,
      token: obscuredToken,
    };
  }
  // ---------------------------------------------------------------------------
}

export default ApiTokensService;
