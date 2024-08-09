import { Request, RequestHandler, Response } from 'express';

import { Authorize } from '../../auth/decorators/authorize.decorator';
import { IdParamsDTO } from '../../common/dtos/id-params.dto';
import { validateBody } from '../../middlewares/validate-body.middleware';
import { validateParams } from '../../middlewares/validate-params.middleware';

import { CreateProductBodyDTO } from './dtos/create-product-body.dto';
import { UpdateProductBodyDTO } from './dtos/update-product-body.dto';
import ProductsService from './products.service';

class ProductsController {
  // -------------------------------------------------------------------------
  private productsService: ProductsService;

  constructor() {
    this.productsService = new ProductsService();
  }

  // ---------------------------------------------------------------------------
  getAllProducts: RequestHandler[] = [
    async (req: Request, res: Response) => {
      const products = await this.productsService.getAllProducts();

      res.json(products);
    },
  ];

  // ---------------------------------------------------------------------------
  getProductById: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const product = await this.productsService.getProductById(parseInt(id, 10));

      res.json(product);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('products.createProduct')
  createProduct: RequestHandler[] = [
    // Validate body
    validateBody(CreateProductBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const newProduct = await this.productsService.createProduct(req.userId!, req.body);

      res.status(201).json(newProduct);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('products.updateProduct')
  updateProduct: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Validate body
    validateBody(UpdateProductBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const updatedProduct = await this.productsService.updateProduct(parseInt(id, 10), req.userId!, req.body);
      res.json(updatedProduct);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('products.deleteProduct')
  deleteProduct: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const deletedProduct = await this.productsService.deleteProduct(parseInt(id, 10), req.userId!);

      res.json(deletedProduct);
    },
  ];

  // ---------------------------------------------------------------------------
}

export default ProductsController;
