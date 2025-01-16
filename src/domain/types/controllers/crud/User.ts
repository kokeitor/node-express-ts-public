import { Request, Response } from "express";
export interface ICrudController {
  getUsers(req: Request, res: Response): Promise<Response>;
  getUserByID(req: Request, res: Response): Promise<Response>;
  postUser(req: Request, res: Response): Promise<Response>;
  putUser(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
}
