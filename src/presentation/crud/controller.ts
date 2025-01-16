import { apiJsonResponse, ICrudController } from "../../domain";
import { Request, Response } from "express";
import { logger } from "../../app";
import { validatePartialUser } from "../../config";

import {
  CustomError,
  CrudRepository,
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
} from "../../domain";

export class CrudController implements ICrudController {
  private repository: CrudRepository;

  constructor(repository: CrudRepository) {
    this.repository = repository;
  }

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

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    const { phone, email } = req.query;
    try {
      let users: UserEntity | UserEntity[] | undefined;
      if (phone && typeof phone === "string") {
        users = await this.repository.findByPhone(phone);
      } else if (email && typeof email === "string") {
        users = await this.repository.findByEmail(email);
      } else {
        users = await this.repository.find();
      }
      if (!users) throw CustomError.notFound("No users found");
      // response
      logger.info(`User found: ${JSON.stringify(users)}`);
      return this.getResponse(
        { message: `Success`, status: 200, content: users },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };

  getUserByID = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
      return this.getResponse(
        { message: `No user Id provided`, status: 400, content: undefined },
        res
      );
    }
    try {
      // validate the format of the ID
      const result = validatePartialUser({ id });
      if (!result.success) {
        throw CustomError.unprocessableEntity("Invalid ID format");
      }
      // find user by ID
      const user = await this.repository.findById(id);
      if (!user) throw CustomError.notFound(`User with ID ${id} not found`);
      logger.info(`Users found: ${JSON.stringify(user)}`);
      // response
      return this.getResponse(
        { message: `Success`, status: 200, content: user },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };
  postUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Validate register request body
      const [err, registerUserDto]: [string?, CreateUserDto?] =
        CreateUserDto.create(req.body);
      if (err) {
        throw CustomError.unprocessableEntity(err);
      }

      // create user
      const createdUser = await this.repository.create(
        registerUserDto as CreateUserDto
      );
      logger.info(`User created: ${JSON.stringify(createdUser)}`);

      // response
      return this.getResponse(
        {
          message: `User created`,
          status: 201,
          content: createdUser,
        },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };
  putUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
      // validate the format of the ID
      const result = validatePartialUser({ id });
      if (!result.success) {
        throw CustomError.unprocessableEntity("Invalid ID format");
      }
      // Validate register request body
      const [err, updateUserDto] = UpdateUserDto.create(req.body);
      if (err) {
        throw CustomError.unprocessableEntity(err);
      }
      // update user
      const updatedUser = await this.repository.update(
        id,
        updateUserDto as UpdateUserDto
      );

      logger.warn(`updatedUser: ${JSON.stringify(updateUserDto)}`);
      // response
      return this.getResponse(
        {
          message: `User updated`,
          status: 200,
          content: updatedUser,
        },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };
  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
      return this.getResponse(
        { message: `No user Id provided`, status: 400, content: undefined },
        res
      );
    }
    try {
      // validate the format of the ID
      const resultID = await validatePartialUser({ id });
      if (!resultID.success) {
        throw CustomError.unprocessableEntity("Invalid ID format");
      }

      // delete user
      const deletedUser = await this.repository.delete(id);

      // response
      return this.getResponse(
        {
          message: `User deleted`,
          status: 200,
          content: deletedUser,
        },
        res
      );
    } catch (error: unknown) {
      return this.handleError(error, res);
    }
  };
}
