import { z } from "zod";

export const registerValidation = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
    name: z.string().optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  }),
});

export const loginValidation = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }),
  }),
});
