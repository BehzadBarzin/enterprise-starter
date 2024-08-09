import { Router } from 'express';

import { getProductsRouter } from './products/products.router';

export async function getApiRoutes(): Promise<Router[]> {
  return [await getProductsRouter()];
}
