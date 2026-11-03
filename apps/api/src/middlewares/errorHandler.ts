import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ success: false, message: "Resource conflict" });
    }
  }

  console.error(err);

  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
};
