import express, { Application, Router } from 'express';

import ProductsController from './products.controller';

/**
 * Returns routes for products API in the given Express application.
 */
export async function getProductsRouter(): Promise<express.Router> {
  const router: Router = express.Router();
  const productsController = new ProductsController();

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // RESTful routes
  router.get('/products/', productsController.getAllProducts);
  // ---------------------------------------------------------------------------
  router.get('/products/:id', productsController.getProductById);
  // ---------------------------------------------------------------------------
  router.post('/products/', productsController.createProduct);
  // ---------------------------------------------------------------------------
  router.patch('/products/:id', productsController.updateProduct);
  // ---------------------------------------------------------------------------
  router.delete('/products/:id', productsController.deleteProduct);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return router;
}
