import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { ApiResponse } from "../../lib/apiResponse";
import { catchAsync } from "../../lib/catchAsync";
import { AuthenticatedRequest } from "../../middlewares/auth";

export const createReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const review = await ReviewService.createReview(req.body, userId);
  return ApiResponse.created(res, "Review added successfully", review);
});

export const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const reviews = await ReviewService.getProductReviews(productId as string);
  return ApiResponse.success(res, "Fetched reviews successfully", reviews);
});

export const updateReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const isAdmin = req.user!.role === "ADMIN";
  const review = await ReviewService.updateReview(req.params.id as string, req.body, userId, isAdmin);
  return ApiResponse.success(res, "Review updated successfully", review);
});

export const deleteReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const isAdmin = req.user!.role === "ADMIN";
  await ReviewService.deleteReview(req.params.id as string, userId, isAdmin);
  return ApiResponse.success(res, "Review deleted successfully");
});
