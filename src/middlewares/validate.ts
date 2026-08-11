import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;

      // Inject parsed values back
      req.body = parsed.body;

      // req.query is getter-only in Express 5 — mutate in place instead of reassigning
      Object.keys(req.query).forEach((key) => delete (req.query as any)[key]);
      Object.assign(req.query, parsed.query);

      req.params = parsed.params;

      next();
    } catch (error) {
      next(error);
    }
  };
};