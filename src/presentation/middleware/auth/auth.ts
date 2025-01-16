import { logger } from "../../../app";
import { JwtAdapter } from "../../../adapters";
import { Request, Response, NextFunction } from "express";
import { apiJsonResponse } from "../../../domain";
import { randomUUID } from "crypto";
import {
  AuthRepository,
  VerifyToken,
  ValidateUserTokenUseCase,
  UserToken,
  CustomError,
  ValidateRolUserUseCase,
  IAuthMiddleware,
} from "../../../domain";

export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    private readonly repository: AuthRepository,
    private readonly verify: VerifyToken = JwtAdapter.verifyToken
  ) {}

  private getResponse(
    apiJsonResponse: apiJsonResponse,
    res: Response
  ): Response {
    return res.status(apiJsonResponse.status).json(apiJsonResponse);
  }

  private handleError(error: unknown, res: Response): Response {
    if (error instanceof CustomError) {
      logger.error(`Custom Error: ${error.message}`);
      return this.getResponse(
        {
          message: error.message,
          status: error.status,
          content: undefined,
        },
        res
      );
    } else {
      logger.error(`Unknown error: ${error}`);
      return this.getResponse(
        {
          message: `Unknown error`,
          status: 500,
          content: undefined,
        },
        res
      );
    }
  }

  validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    // Extrae el header de autorización
    const authorization: string | undefined = req.headers.authorization;

    try {
      if (!authorization) {
        throw CustomError.unauthorized(
          "Unauthorized, no authorization header provided"
        );
      }

      if (!authorization.startsWith("Bearer")) {
        throw CustomError.unauthorized("Unauthorized, invalid Bearer token");
      }

      // Extrae el token
      const token: string = authorization.split(" ").at(1) || "";
      logger.info(`Bearer access token : ${token}`);

      // Verificar si el header es correcto segun el estandar token
      if (token === "") {
        throw CustomError.unauthorized(
          "Unauthorized, no Bearer token provided"
        );
      }

      // Verificar user use case
      const userToken: UserToken = await new ValidateUserTokenUseCase(
        this.repository,
        this.verify
      ).execute(token);

      // Request session
      req.session = {
        id: randomUUID().toString(),
        data: userToken,
      };
      logger.info(`Session data : ${JSON.stringify(req.session)}`);

      // call next middleware/endpoint controller
      next();
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };

  validateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session = req.session;

    try {
      const userToken: UserToken = await new ValidateRolUserUseCase().execute(
        session
      );
      logger.info(`User rol validated succesfully : ${userToken.user.email}`);
      next();
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };
}
