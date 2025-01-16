import { Request, Response, NextFunction } from "express";
export interface IAuthMiddleware {
  validateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  validateRole(req: Request, res: Response, next: NextFunction): void;
}
