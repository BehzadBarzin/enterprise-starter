import { Request, Response, NextFunction } from 'express';

import { prisma } from '../../utils/prisma';
import { ForbiddenError } from '../errors/forbidden.error';
import { UnauthenticatedError } from '../errors/unauthenticated.error';
import { isJWT, JwtPayload, verifyAccessToken } from '../utils/jwt';

// Change the type of Express Request to add the userId and userRoles property
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: number;
      token?: string;
    }
  }
}

/**
 * Creates a middleware function that authorizes a request.
 * the `action` parameter is optional.
 *
 * - If the `action` parameter is provided, the middleware function will check if the user has the permission to perform the action.
 * - If `action` is not provided the middleware will just check if the suer is authenticated.
 *
 * NOTE: Remember to register the action in the database using the `registerAction` function.
 *
 * ```ts
 * app.get('/api/products', authorize(), (req, res) => {
 *   // User is authenticated
 * });
 * ```
 *
 * ```ts
 * app.get('/api/products', authorize('products.createProduct'), (req, res) => {
 *   // User is authenticated and has permission to create products
 * });
 * registerAction('products.createProduct', 'Create a product');
 * ```
 *
 * @param action - The action to be authorized
 */
const authorize = (action?: string) => {
  // Returns the middleware function
  return async (req: Request, res: Response, next: NextFunction) => {
    // -------------------------------------------------------------------------
    // Extract JWT from header
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthenticatedError();
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 && tokenParts[0] !== 'Bearer') {
      throw new UnauthenticatedError();
    }

    const token = tokenParts[1];
    // -------------------------------------------------------------------------
    if (isJWT(token)) {
      // -----------------------------------------------------------------------
      // If token is JWT, use user authentication
      // -----------------------------------------------------------------------
      // Verify JWT
      const payload: JwtPayload | null = verifyAccessToken(token);

      // If payload is null, token is either expired or invalid
      if (!payload || !payload.sub) {
        throw new UnauthenticatedError();
      }

      // -----------------------------------------------------------------------
      // Find user in database (populate roles and permissions)
      const user = await prisma.user.findUnique({
        where: { id: Number(payload.sub) },
        include: {
          roles: {
            include: { permissions: true },
          },
        },
      });

      if (!user) {
        throw new UnauthenticatedError();
      }
      // -----------------------------------------------------------------------
      // Attach userId to request
      req.userId = user.id;
      req.token = token;
      // -----------------------------------------------------------------------
      // If an action is provided, check if the user has the required permission
      // This way, if no action is provided it means that we're just checking if the user is authenticated
      if (action) {
        // Check if any of user's roles has the target permission
        const hasPermission: boolean = user.roles.some((role) => {
          return role.permissions.some((permission) => {
            return permission.action === action;
          });
        });

        if (!hasPermission) {
          throw new ForbiddenError();
        }
      }

      // -----------------------------------------------------------------------
    } else {
      // -----------------------------------------------------------------------
      // If token is not JWT, it must be a valid api token access key
      // -----------------------------------------------------------------------
      // Find api token from DB
      const apiToken = await prisma.apiToken.findFirst({
        where: { token: token, expiresAt: { gte: new Date() } },
        include: { permissions: true },
      });

      if (!apiToken) {
        throw new UnauthenticatedError();
      }

      // -----------------------------------------------------------------------
      // Attach userId of the api token's creator to the request object
      req.userId = apiToken.userId;
      // -----------------------------------------------------------------------
      // If an action is provided, check if the api token has the required permission
      if (action) {
        // If api token isn't fullAccess, check to see if the api token has permission
        if (!apiToken.fullAccess) {
          const hasPermission: boolean = apiToken.permissions.some((permission) => {
            return permission.action === action;
          });

          if (!hasPermission) {
            throw new ForbiddenError();
          }
        }
      }
      // -----------------------------------------------------------------------
    }
    // -------------------------------------------------------------------------
    next();
    return;
  };
};

export default authorize;
