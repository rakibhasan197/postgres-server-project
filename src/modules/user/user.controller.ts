import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ApiResponse } from "../../lib/apiResponse";
import { catchAsync } from "../../lib/catchAsync";
import { AuthenticatedRequest } from "../../middlewares/auth";

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  return ApiResponse.success(res, "Fetched all users successfully", users);
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id as string);
  return ApiResponse.success(res, "Fetched user details successfully", user);
});

export const updateUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.id as string;
  const requester = req.user;

  if (requester?.role !== "ADMIN" && requester?.id !== targetId) {
    return ApiResponse.forbidden(res, "You can only update your own profile");
  }

  const updatedUser = await UserService.updateUser(targetId, req.body);
  return ApiResponse.success(res, "User profile updated successfully", updatedUser);
});

export const deleteUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.id as string;
  const requester = req.user;

  if (requester?.role !== "ADMIN" && requester?.id !== targetId) {
    return ApiResponse.forbidden(res, "You can only delete your own profile");
  }

  const deletedUser = await UserService.deleteUser(targetId);
  return ApiResponse.success(res, "User deleted successfully", deletedUser);
});
