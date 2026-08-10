import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: any = null;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.issues.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  // Handle Prisma errors
  if (err.code && err.code.startsWith("P")) {
    statusCode = 400;
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Unique constraint violation";
      const target = err.meta?.target as string[];
      errors = target ? `A record with this ${target.join(", ")} already exists.` : "Record already exists.";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    } else {
      message = `Database Error: ${err.message}`;
    }
  }

  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDev && { stack: err.stack }),
  });
};
