import {
  CreateUserDto,
  UpdateUserDto,
  UserEntity,
  ICrudRepository,
} from "../../../domain";

export abstract class CrudRepository
  implements ICrudRepository<CreateUserDto, UpdateUserDto, UserEntity>
{
  abstract find(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | undefined>;
  abstract findByEmail(email: string): Promise<UserEntity | undefined>;
  abstract findByPhone(phone: string): Promise<UserEntity | undefined>;
  abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
  abstract update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity>;
  abstract delete(id: string): Promise<UserEntity>;
}
