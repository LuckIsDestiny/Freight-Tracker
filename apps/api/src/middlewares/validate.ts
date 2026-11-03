import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export type paramFormat = "body" | "query" | "params";

export const validate = (schema: z.ZodType, format: paramFormat = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (format === "query") {
        res.locals[format] = schema.parse(req[format]);
      } else {
        req[format] = schema.parse(req[format]);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
