import { Response } from "express";

export class ApiResponse {
  static send(
    res: Response,
    statusCode: number,
    message: string,
    data: any = null,
    meta: any = null
  ) {
    return res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  static success(res: Response, message: string, data: any = null, meta: any = null) {
    return this.send(res, 200, message, data, meta);
  }

  static created(res: Response, message: string, data: any = null) {
    return this.send(res, 201, message, data);
  }

  static badRequest(res: Response, message: string) {
    return this.send(res, 400, message);
  }

  static unauthorized(res: Response, message: string = "Unauthorized") {
    return this.send(res, 401, message);
  }

  static forbidden(res: Response, message: string = "Forbidden") {
    return this.send(res, 403, message);
  }

  static notFound(res: Response, message: string = "Resource not found") {
    return this.send(res, 404, message);
  }

  static error(res: Response, message: string = "Internal server error", error: any = null) {
    const isDev = process.env.NODE_ENV === "development";
    return res.status(500).json({
      success: false,
      message,
      ...(isDev && error && { error: error.message || error }),
    });
  }
}
