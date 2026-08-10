import { prisma } from "../../lib/prisma";

export class CategoryService {
  static async createCategory(data: any) {
    const existing = await prisma.category.findFirst({
      where: { name: data.name, isDeleted: false },
    });

    if (existing) {
      const err: any = new Error("Category name already exists");
      err.statusCode = 409;
      throw err;
    }

    return prisma.category.create({
      data,
    });
  }

  static async getAllCategories() {
    return prisma.category.findMany({
      where: { isDeleted: false },
      orderBy: { name: "asc" },
    });
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: {
        products: {
          where: { isDeleted: false },
        },
      },
    });

    if (!category) {
      const err: any = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    return category;
  }

  static async updateCategory(id: string, data: any) {
    await this.getCategoryById(id);

    if (data.name) {
      const existing = await prisma.category.findFirst({
        where: { name: data.name, isDeleted: false, NOT: { id } },
      });

      if (existing) {
        const err: any = new Error("Category name already exists");
        err.statusCode = 409;
        throw err;
      }
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    await this.getCategoryById(id);

    return prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
