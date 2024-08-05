import express, { Express, Request, Response, json } from 'express';
import 'express-async-errors'; // Must be imported at the beg

// Make sure to import the env file first
import './utils/env';
import { NotFoundError } from './errors/not-found.error';
import { errorHandler } from './middlewares/error-handler.middleware';
import { requestLogger } from './middlewares/request-logger.middleware';

export async function createServer() {
  const app: Express = express();

  // Serve static files
  app.use(express.static('public'));

  // Parse JSON request bodies
  app.use(json());

  // Setup request logger
  app.use(requestLogger);

  app.get('/', (req: Request, res: Response) => {
    throw new NotFoundError();
  });

  // ---------------------------------------------------------------------------
  // Add custom routes here
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
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
