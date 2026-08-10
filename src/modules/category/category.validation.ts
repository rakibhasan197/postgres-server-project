import { z } from "zod";

export const createCategoryValidation = z.object({
  body: z.object({
    name: z.string({ message: "Category name is required" }).min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid category ID format"),
  }),
  query: z.object({}).optional(),
});

export const categoryIdValidation = z.object({
  params: z.object({
    id: z.string().uuid("Invalid category ID format"),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});
