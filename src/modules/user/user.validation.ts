import { z } from "zod";

export const updateUserValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const userIdValidation = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID format"),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});
