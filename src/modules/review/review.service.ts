import { prisma } from "../../lib/prisma";

export class ReviewService {
  static async createReview(data: any, userId: string) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      const err: any = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    const existing = await prisma.review.findFirst({
      where: { userId, productId: data.productId },
    });

    if (existing) {
      const err: any = new Error("You have already reviewed this product");
      err.statusCode = 409;
      throw err;
    }

    return prisma.review.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async getProductReviews(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const err: any = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    return prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateReview(id: string, data: any, userId: string, isAdmin: boolean) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      const err: any = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }

    if (review.userId !== userId && !isAdmin) {
      const err: any = new Error("You are not authorized to update this review");
      err.statusCode = 403;
      throw err;
    }

    return prisma.review.update({
      where: { id },
      data,
    });
  }

  static async deleteReview(id: string, userId: string, isAdmin: boolean) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      const err: any = new Error("Review not found");
      err.statusCode = 404;
      throw err;
    }

    if (review.userId !== userId && !isAdmin) {
      const err: any = new Error("You are not authorized to delete this review");
      err.statusCode = 403;
      throw err;
    }

    return prisma.review.delete({
      where: { id },
    });
  }
}
