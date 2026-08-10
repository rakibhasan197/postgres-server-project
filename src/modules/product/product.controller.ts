import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { ApiResponse } from "../../lib/apiResponse";
import { catchAsync } from "../../lib/catchAsync";
import { AuthenticatedRequest } from "../../middlewares/auth";

export const createProduct = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const vendorId = req.user!.id;
  const product = await ProductService.createProduct(req.body, vendorId);
  return ApiResponse.created(res, "Product created successfully", product);
});

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await ProductService.getAllProducts(req.query);
  return ApiResponse.success(res, "Fetched all products successfully", products);
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.getProductById(req.params.id as string);
  return ApiResponse.success(res, "Fetched product successfully", product);
});

export const updateProduct = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const isAdmin = req.user!.role === "ADMIN";
  const product = await ProductService.updateProduct(req.params.id as string, req.body, userId, isAdmin);
  return ApiResponse.success(res, "Product updated successfully", product);
});

export const deleteProduct = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const isAdmin = req.user!.role === "ADMIN";
  await ProductService.deleteProduct(req.params.id as string, userId, isAdmin);
  return ApiResponse.success(res, "Product deleted successfully");
});
