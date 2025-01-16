import { Request, Response } from "express";
import { logger } from "../../app";
import { JwtAdapter } from "../../adapters";
import {
  CustomError,
  AuthRepository,
  LoginUserUseCase,
  RegisterUserDto,
  LoginUserDto,
  RegisterUserUseCAse,
  UserToken,
  VerifyUserUseCase,
  apiJsonResponse,
  IAuthController,
} from "../../domain";

export class AuthController implements IAuthController {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  private getResponse(
    apiJsonResponse: apiJsonResponse,
    res: Response
  ): Response {
    return res.status(apiJsonResponse.status).json(apiJsonResponse);
  }

  private handleError(error: unknown, res: Response): Response {
    logger.error(`Custom Error: ${error}`);
    if (error instanceof CustomError) {
      logger.error(`Custom error: ${error.message}`);
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

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      // validate user data
      const [err, registerUserDto]: [string?, RegisterUserDto?] =
        RegisterUserDto.create(req.body);
      if (err) {
        throw CustomError.unprocessableEntity(err);
      }

      // use register use case execution
      const UserToken = await new RegisterUserUseCAse(
        this.repository,
        JwtAdapter.generateToken
      ).execute(registerUserDto as RegisterUserDto);

      logger.info(`User registered token: ${JSON.stringify(UserToken)}`);
      return this.getResponse(
        {
          message: `User registered`,
          status: 201,
          content: UserToken,
        },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      // validate user login data
      const [err, loginUserDto]: [string?, LoginUserDto?] = LoginUserDto.create(
        req.body
      );
      if (err) {
        throw CustomError.unprocessableEntity(err);
      }

      // login user use case execution
      const UserToken: UserToken = await new LoginUserUseCase(
        this.repository,
        JwtAdapter.generateToken
      ).execute(loginUserDto as LoginUserDto);

      return this.getResponse(
        {
          message: `User logged in`,
          status: 200,
          content: UserToken,
        },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.params;
    try {
      if (!token) {
        throw CustomError.badRequest("No verification token provided");
      }
      /// Verification token use case
      const userToken: UserToken = await new VerifyUserUseCase(
        this.repository,
        JwtAdapter.verifyToken
      ).execute(token);

      return this.getResponse(
        {
          message: `Token verified`,
          status: 200,
          content: userToken,
        },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };
}
