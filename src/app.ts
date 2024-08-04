import express, { Express, Request, Response, json } from 'express';

// Make sure to import the env file first
import './utils/env';

export async function createServer() {
  const app: Express = express();

  // Serve static files
  app.use(express.static('public'));

  // Parse JSON request bodies
  app.use(json());

  app.get('/', (req: Request, res: Response) => {
    res.json({ data: 'Hello World!' });
  });

  return app;
}
