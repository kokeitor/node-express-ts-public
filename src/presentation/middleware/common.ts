import { logger } from "../../app";
import { Request, Response, NextFunction } from "express";

export function logMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.info(`Request: ${req.method} : ${req.url}`);
  next();
}
