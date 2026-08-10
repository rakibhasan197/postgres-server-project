import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
    name?: string | null;
  };
}

export const auth = (roles: ("USER" | "ADMIN")[] = []) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, name: true },
      });

      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        return;
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        res.status(403).json({ success: false, message: "Forbidden: Access denied" });
        return;
      }

      (req as AuthenticatedRequest).user = user;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  };
};
