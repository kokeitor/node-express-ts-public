import { Router } from "express";
import { CrudController, AuthMiddleware } from "../../presentation";
import {
  CrudDatasource,
  CrudRepository,
  AuthRepository,
  ICrudController,
  IAuthMiddleware,
} from "../../domain";
import {
  CrudRepositoryImpl,
  CrudDatasourceImpl,
  AuthRepositoryImpl,
} from "../../infrastructure";
import { Pool } from "pg";
import { getPostgresConfig } from "../../config";
import { IEnvs } from "../../domain";

export function getUserRouter(envs: IEnvs): Router {
  const usersRouter = Router();
  const postgresqlPool: Pool = new Pool(getPostgresConfig(envs));
  const datasource: CrudDatasource = new CrudDatasourceImpl(postgresqlPool);
  const userRepository: CrudRepository = new CrudRepositoryImpl(datasource);
  const userController: ICrudController = new CrudController(userRepository);
  const authRepository: AuthRepository = new AuthRepositoryImpl(datasource);
  const authMiddleware: IAuthMiddleware = new AuthMiddleware(authRepository);

  usersRouter.get(
    "/",
    authMiddleware.validateToken,
    authMiddleware.validateRole,
    userController.getUsers
  );
  usersRouter.get(
    "/:id",
    authMiddleware.validateToken,
    authMiddleware.validateRole,
    userController.getUserByID
  );
  usersRouter.post(
    "/",
    authMiddleware.validateToken,
    authMiddleware.validateRole,
    userController.postUser
  );
  usersRouter.put(
    "/:id",
    authMiddleware.validateToken,
    authMiddleware.validateRole,
    userController.putUser
  );
  usersRouter.delete(
    "/:id",
    authMiddleware.validateToken,
    authMiddleware.validateRole,
    userController.deleteUser
  );
  return usersRouter;
}
