import {
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
  IAuthRepository,
} from "../../../domain";

export abstract class AuthRepository
  implements IAuthRepository<RegisterUserDto, LoginUserDto, UserEntity>
{
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract verify(id: string): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | undefined>;
}
