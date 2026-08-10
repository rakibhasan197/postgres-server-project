import { z } from "zod";

export const createReviewValidation = z.object({
  body: z.object({
    rating: z.number({ message: "Rating is required" }).int().min(1).max(5),
    comment: z.string().optional(),
    productId: z.string({ message: "ProductId is required" }).uuid("Invalid product ID format"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateReviewValidation = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid review ID format"),
  }),
  query: z.object({}).optional(),
});

export const reviewIdValidation = z.object({
  params: z.object({
    id: z.string().uuid("Invalid review ID format"),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});
