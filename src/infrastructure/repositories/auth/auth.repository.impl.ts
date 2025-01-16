import { BcryptAdapter } from "../../../adapters";
import {
  AuthRepository,
  UserEntity,
  RegisterUserDto,
  LoginUserDto,
  CrudDatasource,
  CustomError,
  UpdateUserDto,
} from "../../../domain";
import { logger } from "../../../app";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: CrudDatasource) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    // verify if user email and user phone already exists
    const existsEmail: UserEntity | undefined =
      await this.datasource.findByEmail(registerUserDto.email);

    if (existsEmail) {
      throw CustomError.badRequest(
        `User with email : ${registerUserDto.email} already exist`
      );
    }

    const existsPhone: UserEntity | undefined =
      await this.datasource.findByPhone(registerUserDto.phone);

    if (existsPhone) {
      throw CustomError.badRequest(
        `User with phone : ${registerUserDto.phone} already exist`
      );
    }
    // create user using the datasource method
    const user: UserEntity = await this.datasource.create(registerUserDto);
    return user;
  }

  async login(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    // find user by email
    const user: UserEntity | undefined = await this.datasource.findByEmail(
      LoginUserDto.email
    );
    if (!user) {
      throw CustomError.badRequest(
        `User with email : ${LoginUserDto.email} does not exist`
      );
    }

    // verify check password
    const matchPassword: boolean = BcryptAdapter.compare(
      LoginUserDto.password,
      user.password
    );
    if (!matchPassword) throw CustomError.unauthorized("Invalid password");
    return user;
  }

  async verify(id: string): Promise<UserEntity> {
    // find user by ID
    const user: UserEntity | undefined = await this.datasource.findById(id);
    if (!user) {
      throw CustomError.notFound(`User with ID : ${id} does not exist`);
    }

    // check if user is disabled
    if (user.is_disabled) {
      throw CustomError.forbidden(`User with ID : ${id} is disabled`);
    }

    // check if user is verified
    if (!user.is_verified) {
      //verify user
      user.is_verified = true;

      // create update user dto
      const [err, updateUserDto]: [string?, UpdateUserDto?] =
        UpdateUserDto.create({
          is_verified: true,
        });
      logger.info(`Update user dto : ${JSON.stringify(updateUserDto)}`);
      if (err) {
        throw CustomError.internalServerError("Error verificating user");
      }

      // update user using datasource
      const updatedUserEntity: UserEntity = await this.datasource.update(
        id as string,
        updateUserDto as UpdateUserDto
      );
      return updatedUserEntity;
    }
    return user;
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return await this.datasource.findById(id);
  }
}
