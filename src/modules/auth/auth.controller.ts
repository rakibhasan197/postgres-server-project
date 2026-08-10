import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../lib/apiResponse";
import { catchAsync } from "../../lib/catchAsync";
import { AuthenticatedRequest } from "../../middlewares/auth";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  return ApiResponse.created(res, "User registered successfully", result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  return ApiResponse.success(res, "Login successful", result);
});

export const getMe = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  return ApiResponse.success(res, "Fetched user profile successfully", req.user);
});
