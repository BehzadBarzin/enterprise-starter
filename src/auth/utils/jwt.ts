import { User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { CleanUser } from '../api/users/users.service';

// =============================================================================

export type { JwtPayload } from 'jsonwebtoken';

// =============================================================================
/**
 * Generate JWT Access token
 */
export function generateAccessToken(user: User | CleanUser): string {
  const payload = {
    sub: user.id,
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME!,
  });
}

// =============================================================================
/**
 * Generate JWT Refresh token
 */
export function generateRefreshToken(user: User | CleanUser): string {
  const payload = {
    sub: user.id,
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME!,
  });
}

// =============================================================================
/**
 * Verify JWT Access Token
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// =============================================================================
/**
 * Verify JWT Refresh Token
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// =============================================================================
/**
 * Determine if string is a JWT
 */
export function isJWT(token: string): boolean {
  return token.split('.').length === 3;
}
// =============================================================================
