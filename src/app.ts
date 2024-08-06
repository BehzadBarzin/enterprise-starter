import 'reflect-metadata'; // Import this before any other imports (used by class-transformer)

import express, { Express, Request, Response, json } from 'express';
import 'express-async-errors'; // Must be imported at the beg

// Make sure to import the env file first
import './utils/env';
import { getAuthRoutes } from './auth/api';
import { NotFoundError } from './errors/not-found.error';
import { errorHandler } from './middlewares/error-handler.middleware';
import { requestLogger } from './middlewares/request-logger.middleware';

export async function createServer() {
  const app: Express = express();

  // ---------------------------------------------------------------------------
  // Middlewares
  // ---------------------------------------------------------------------------
  // Serve static files
  app.use(express.static('public'));

  // Parse JSON request bodies
  app.use(json());

  // ---------------------------------------------------------------------------
  // Custom Middlewares
  // ---------------------------------------------------------------------------
  // Setup request logger
  app.use(requestLogger);

  // ---------------------------------------------------------------------------
  // Add custom routes here
  // ---------------------------------------------------------------------------
  app.get('/', (req: Request, res: Response) => {
    throw new NotFoundError();
  });

  app.use('/auth', await getAuthRoutes());

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Error handling
  // ---------------------------------------------------------------------------
  // Catch all unhandled routes and forward to error handler
  app.all('*', (req, res) => {
    throw new NotFoundError();
  });

  // Catch all errors and forward to error handler middleware
  app.use(errorHandler);
  // ---------------------------------------------------------------------------

  return app;
}
