import { Request, Response } from "express";
export interface IAuthController {
  register(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  verifyToken(req: Request, res: Response): Promise<Response>;
}
