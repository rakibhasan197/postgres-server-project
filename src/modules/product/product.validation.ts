import { z } from "zod";

export const createProductValidation = z.object({
  body: z.object({
    title: z.string({ message: "Product title is required" }).min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    price: z.number({ message: "Price is required" }).positive("Price must be positive"),
    stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
    categoryId: z.string({ message: "CategoryId is required" }).uuid("Invalid category ID format"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProductValidation = z.object({
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters").optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive").optional(),
    stock: z.number().int().nonnegative("Stock cannot be negative").optional(),
    categoryId: z.string().uuid("Invalid category ID format").optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid product ID format"),
  }),
  query: z.object({}).optional(),
});

export const productIdValidation = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID format"),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});
