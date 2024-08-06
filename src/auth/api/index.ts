import { Application } from 'express';

import { registerApiTokensRouter } from './api-tokens/api-tokens.router';
import { registerAuthRouter } from './auth/auth.router';
import { registerPasswordResetRouter } from './password-reset/password-reset.router';
import { registerPermissionsRouter } from './permissions/permissions.router';
import { registerRolesRouter } from './roles/roles.router';
import { registerUsersRouter } from './users/users.router';

export async function registerAllAuthRoutes(app: Application) {
  await registerUsersRouter(app);
  await registerPermissionsRouter(app);
  await registerRolesRouter(app);
  await registerAuthRouter(app);
  await registerPasswordResetRouter(app);
  await registerApiTokensRouter(app);
}
