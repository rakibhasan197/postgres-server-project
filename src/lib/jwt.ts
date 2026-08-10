import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (payload: object, expiresIn: string = env.JWT_EXPIRES_IN): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, env.JWT_SECRET);
};
