import {
  CrudRepository,
  CrudDatasource,
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
} from "../../../domain";

export class CrudRepositoryImpl implements CrudRepository {
  constructor(private readonly datasource: CrudDatasource) {}

  find(): Promise<UserEntity[]> {
    return this.datasource.find();
  }
  findById(id: string): Promise<UserEntity | undefined> {
    return this.datasource.findById(id);
  }
  findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.datasource.findByEmail(email);
  }
  findByPhone(phone: string): Promise<UserEntity | undefined> {
    return this.datasource.findByPhone(phone);
  }
  create(data: CreateUserDto): Promise<UserEntity> {
    return this.datasource.create(data);
  }
  update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    return this.datasource.update(id, data);
  }
  delete(id: string): Promise<UserEntity> {
    return this.datasource.delete(id);
  }
}
