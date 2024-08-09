import { Product } from '@prisma/client';

import { ForbiddenError } from '../../auth/errors/forbidden.error';
import { NotFoundError } from '../../errors/not-found.error';
import { prisma } from '../../utils/prisma';

import { CreateProductBodyDTO } from './dtos/create-product-body.dto';
import { UpdateProductBodyDTO } from './dtos/update-product-body.dto';

class ProductsService {
  // ---------------------------------------------------------------------------
  async getAllProducts(): Promise<Product[]> {
    return await prisma.product.findMany();
  }

  // ---------------------------------------------------------------------------
  async getProductById(id: number): Promise<Product> {
    const product = await prisma.product.findFirst({ where: { id } });
    if (!product) {
      throw new NotFoundError('Product Not Found');
    }

    return product;
  }

  // ---------------------------------------------------------------------------
  async createProduct(requestUserId: number, productData: CreateProductBodyDTO): Promise<Product> {
    const newProduct = await prisma.product.create({
      data: {
        ...productData,
        user: {
          connect: { id: requestUserId },
        },
      },
    });

    return newProduct;
  }

  // ---------------------------------------------------------------------------
  async updateProduct(productId: number, requestUserId: number, productData: UpdateProductBodyDTO): Promise<Product> {
    const productToUpdate = await prisma.product.findFirst({
      where: { id: productId },
      select: { id: true, user: { select: { id: true } } },
    });
    if (!productToUpdate) {
      throw new NotFoundError(`Product Not Found`);
    }

    // User must be the creator
    if (productToUpdate.user.id !== requestUserId) {
      throw new ForbiddenError();
    }

    // Merge the existing product with the new data
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
      },
    });

    return updatedProduct;
  }

  // ---------------------------------------------------------------------------
  async deleteProduct(productId: number, requestUserId: number): Promise<Product> {
    const productToDelete = await prisma.product.findFirst({
      where: { id: productId },
      select: { id: true, user: { select: { id: true } } },
    });
    if (!productToDelete) {
      throw new NotFoundError('Product Not Found');
    }

    // User must be the creator
    if (productToDelete.user.id !== requestUserId) {
      throw new ForbiddenError();
    }

    return await prisma.product.delete({
      where: { id: productId },
    });
  }

  // ---------------------------------------------------------------------------
}

export default ProductsService;
