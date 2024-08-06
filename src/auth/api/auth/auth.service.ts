import { User } from '@prisma/client';
import ms from 'ms';

import { BadRequestError } from '../../../errors/bad-request.error';
import { UnauthenticatedError } from '../../errors/unauthenticated.error';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { validateHash } from '../../utils/password';
import UsersService, { CleanUser } from '../users/users.service';

import { LoginBodyDTO } from './dtos/login-body.dto';
import { RegisterBodyDTO } from './dtos/register-body.dto';

// =============================================================================
/**
 * Type for authentication / refresh response to user
 */
export interface AuthResponse {
  user: CleanUser;
  accessToken: {
    token: string;
    issuedAt?: number;
    expiresAt?: number;
  };
  refreshToken: {
    token: string;
    issuedAt?: number;
    expiresAt?: number;
  };
}

// =============================================================================
class AuthService {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  // ---------------------------------------------------------------------------
  async register(registerData: RegisterBodyDTO): Promise<AuthResponse> {
    const newUser = await this.usersService.createUser(registerData);

    // Login
    return this.generateTokens(newUser);
  }

  // ---------------------------------------------------------------------------
  async login(loginData: LoginBodyDTO): Promise<AuthResponse> {
    // Get user from user service including password
    const user: User = (await this.usersService.getUserByEmail(loginData.email, true)) as User;
    if (!user || !user.password) {
      throw new BadRequestError('Bad Credentials');
    }

    // Validate password
    const isPasswordValid = await validateHash(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Bad Credentials');
    }

    return this.generateTokens(user);
  }

  // ---------------------------------------------------------------------------
  async refresh(refreshToken: string): Promise<AuthResponse> {
    return this.refreshAccessToken(refreshToken);
  }

  // ---------------------------------------------------------------------------
  async me(userId: number): Promise<CleanUser> {
    return this.usersService.getUserById(userId);
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  /**
   * A utility function to generate access and refresh tokens
   *
   * @param user the user for which we want to generate tokens
   * @returns the generated tokens
   */
  private generateTokens(user: CleanUser): AuthResponse {
    const issuedAt = new Date().getTime();
    const accessTokenExpiresAt = issuedAt + ms(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME!);
    const refreshTokenExpiresAt = issuedAt + ms(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME!);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: user,
      accessToken: {
        token: accessToken,
        issuedAt,
        expiresAt: accessTokenExpiresAt,
      },
      refreshToken: {
        token: refreshToken,
        issuedAt,
        expiresAt: refreshTokenExpiresAt,
      },
    };
  }

  // ---------------------------------------------------------------------------
  /**
   * A utility function to create a new access token from a refresh token
   *
   * @param refreshToken the refresh token
   * @returns the new access token and the old refresh token
   */
  private async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthenticatedError();
    }

    const user: CleanUser = await this.usersService.getUserById(Number(payload.sub));

    if (!user) {
      throw new UnauthenticatedError();
    }

    const accessTokenExpiresAt = new Date().getTime() + ms(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME!);

    const tokens = {
      user: user,
      accessToken: {
        token: generateAccessToken(user),
        issuedAt: new Date().getTime(),
        expiresAt: accessTokenExpiresAt,
      },
      refreshToken: {
        token: refreshToken,
        issuedAt: payload.iat,
        expiresAt: payload.exp,
      },
    };

    return tokens;
  }

  // ---------------------------------------------------------------------------
}

export default AuthService;
