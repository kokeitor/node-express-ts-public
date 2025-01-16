import {
  CreateUserDto,
  RegisterUserDto,
  UpdateUserDto,
  UserEntity,
  IDatasource,
} from "../../../domain";

export abstract class CrudDatasource
  implements
    IDatasource<CreateUserDto, RegisterUserDto, UpdateUserDto, UserEntity>
{
  abstract find(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | undefined>;
  abstract findByEmail(email: string): Promise<UserEntity | undefined>;
  abstract findByPhone(phone: string): Promise<UserEntity | undefined>;
  abstract create(
    userDto: CreateUserDto | RegisterUserDto
  ): Promise<UserEntity>;
  abstract update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity>;
  abstract delete(id: string): Promise<UserEntity>;
}
