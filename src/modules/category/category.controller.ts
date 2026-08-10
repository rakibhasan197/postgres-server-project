import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { ApiResponse } from "../../lib/apiResponse";
import { catchAsync } from "../../lib/catchAsync";

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  return ApiResponse.created(res, "Category created successfully", category);
});

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  return ApiResponse.success(res, "Fetched all categories successfully", categories);
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.getCategoryById(req.params.id as string);
  return ApiResponse.success(res, "Fetched category successfully", category);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.updateCategory(req.params.id as string, req.body);
  return ApiResponse.success(res, "Category updated successfully", category);
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.deleteCategory(req.params.id as string);
  return ApiResponse.success(res, "Category deleted successfully", category);
});
