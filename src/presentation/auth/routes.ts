import { Router } from "express";
import { AuthController } from "../../presentation";
import { AuthRepository, CrudDatasource, IAuthController } from "../../domain";
import { AuthRepositoryImpl, CrudDatasourceImpl } from "../../infrastructure";
import { Pool } from "pg";
import { getPostgresConfig } from "../../config";
import { IEnvs } from "../../domain";

export function getAuthRouter(envs: IEnvs): Router {
  const authRouter = Router();
  const postgresqlPool: Pool = new Pool(getPostgresConfig(envs));
  const datasource: CrudDatasource = new CrudDatasourceImpl(postgresqlPool);
  const authRepository: AuthRepository = new AuthRepositoryImpl(datasource);
  const authController: IAuthController = new AuthController(authRepository);

  authRouter.post("/login", authController.login);
  authRouter.post("/register", authController.register);
  authRouter.get("/verify-token/:token", authController.verifyToken);
  return authRouter;
}
