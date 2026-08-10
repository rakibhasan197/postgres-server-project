import { prisma } from "../../lib/prisma";

export class ProductService {
  static async createProduct(data: any, vendorId: string) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      const err: any = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    return prisma.product.create({
      data: {
        ...data,
        vendorId,
      },
    });
  }

  static async getAllProducts(filter: any = {}) {
    const { categoryId, minPrice, maxPrice, search } = filter;

    const where: any = { isDeleted: false };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        vendor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: { select: { id: true, name: true } },
        vendor: { select: { id: true, name: true, email: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      const err: any = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    return product;
  }

  static async updateProduct(id: string, data: any, vendorId: string, isAdmin: boolean) {
    const product = await this.getProductById(id);

    if (product.vendorId !== vendorId && !isAdmin) {
      const err: any = new Error("You are not authorized to update this product");
      err.statusCode = 403;
      throw err;
    }

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, isDeleted: false },
      });
      if (!category) {
        const err: any = new Error("Category not found");
        err.statusCode = 404;
        throw err;
      }
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async deleteProduct(id: string, vendorId: string, isAdmin: boolean) {
    const product = await this.getProductById(id);

    if (product.vendorId !== vendorId && !isAdmin) {
      const err: any = new Error("You are not authorized to delete this product");
      err.statusCode = 403;
      throw err;
    }

    return prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
