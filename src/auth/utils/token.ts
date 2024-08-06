import { randomBytes } from 'crypto';

export function generateToken(length: number = 64): string {
  return randomBytes(length).toString('hex');
}
