import { Router } from 'express';

import { getApiTokensRouter } from './api-tokens/api-tokens.router';
import { getAuthRouter } from './auth/auth.router';
import { getPasswordResetRouter } from './password-reset/password-reset.router';
import { getPermissionsRouter } from './permissions/permissions.router';
import { getRolesRouter } from './roles/roles.router';
import { getUsersRouter } from './users/users.router';

export async function getAuthRoutes(): Promise<Router[]> {
  return [
    await getUsersRouter(),
    await getPermissionsRouter(),
    await getRolesRouter(),
    await getAuthRouter(),
    await getPasswordResetRouter(),
    await getApiTokensRouter(),
  ];
}
