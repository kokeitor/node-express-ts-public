import {
  CrudDatasource,
  UserEntity,
  CreateUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from "../../../domain";
import { Pool, QueryResult, QueryResultRow, PoolClient } from "pg";
import { logger } from "../../../app";
import { CustomError, QueryOptions } from "../../../domain";
import { UserEntityMapper } from "../../../infrastructure";
import { randomUUID } from "crypto";

export class CrudDatasourceImpl implements CrudDatasource {
  constructor(private readonly pool: Pool) {
    //this.pool = new Pool(getPostgresConfig(envs));
  }

  async executeTransaction(options: QueryOptions): Promise<QueryResultRow[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const res: QueryResult = await client.query(options);
      await client.query("COMMIT");
      return res.rows;
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error(`Transaction failed: ${error}`);
      throw CustomError.internalServerError(
        "Database error : transaction failed"
      );
    } finally {
      // Liberar el cliente de vuelta al pool
      client.release();
      // Opcional: cerrar el pool cuando tu aplicación termina
      // await pool.end();
    }
  }

  async executeQuery(options: QueryOptions): Promise<QueryResultRow[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const res: QueryResult = await client.query(options);
      return res.rows;
    } catch (error) {
      logger.error(`Query failed: ${error}`);
      throw CustomError.internalServerError("Database error : query failed");
    } finally {
      // Opcional: cerrar el pool cuando tu aplicación termina
      // Liberar el cliente de vuelta al pool
      client.release();
    }
  }
  async find(): Promise<UserEntity[]> {
    const options: QueryOptions = {
      name: "fetch-users",
      text: "SELECT *  FROM users",
    };
    const users = await this.executeQuery(options);
    if (users.length === 0) throw CustomError.notFound("No users found");
    // map "database object" to "user entity"
    return users.map((user) => UserEntityMapper.userEntityFromObject(user));
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    const options: QueryOptions = {
      name: "fetch-user-by-ID",
      text: `SELECT * FROM users AS u WHERE u.id = $1`,
      values: [id],
    };
    const [user] = await this.executeQuery(options);
    // if (!user) throw CustomError.notFound(`UserEntity with ID ${id} not found`);
    if (!user) return user;
    // map "database object" to "user entity"

    return UserEntityMapper.userEntityFromObject(user);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const options: QueryOptions = {
      name: "fetch-user-by-email",
      text: `SELECT * FROM users AS u WHERE u.email = $1`,
      values: [email],
    };
    const [user] = await this.executeQuery(options);
    // if (!user) throw CustomError.notFound(`User with email ${email} not found`);
    if (!user) return user;
    // map "database object" to "user entity"
    return UserEntityMapper.userEntityFromObject(user);
  }

  async findByPhone(phone: string): Promise<UserEntity | undefined> {
    const options: QueryOptions = {
      name: "fetch-user-by-phone",
      text: `SELECT * FROM users WHERE phone = $1`,
      values: [phone],
    };
    const [user] = await this.executeQuery(options);
    // if (!user) throw CustomError.notFound(`User with phone ${phone} not found`);
    if (!user) return user;
    return UserEntityMapper.userEntityFromObject(user);
  }

  async create(userDto: CreateUserDto | RegisterUserDto): Promise<UserEntity> {
    const existsEmail: UserEntity | undefined = await this.findByEmail(
      userDto.email
    );
    if (existsEmail)
      throw CustomError.badRequest(
        `User with email : ${userDto.email} already exist`
      );

    const existsPhone: UserEntity | undefined = await this.findByPhone(
      userDto.phone
    );
    if (existsPhone)
      throw CustomError.badRequest(
        `User with phone : ${userDto.phone} already exist`
      );

    const id: string = randomUUID();
    const timestamp: string = new Date().toISOString();
    const registration_date: string = timestamp;

    const options: QueryOptions = {
      name: "insert-user",
      text: `
        INSERT INTO users 
          (id, name, surname, gender, email, phone, rol, password, is_verified, is_disabled, timestamp, registration_date, nickname)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;
      `,
      values: [
        id, // $1: ID
        userDto.name, // $2: Name
        userDto.surname, // $3: Surname
        userDto.gender, // $4: Gender
        userDto.email, // $5: Email
        userDto.phone, // $6: Phone
        userDto.rol, // $7: Role
        userDto.password, // $8: Password
        userDto.is_verified, // $9: Is Verified
        userDto.is_disabled, // $10: Is Disabled
        timestamp, // $11: Timestamp
        registration_date, // $12: Registration Date
        userDto.nickname, // $13: Nickname
      ],
    };

    const [userCreated] = await this.executeTransaction(options);
    if (!userCreated)
      throw CustomError.internalServerError("Error creating user");
    return UserEntityMapper.userEntityFromObject(userCreated);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user: UserEntity | undefined = await this.findById(id);
    logger.info(`user to update: ${JSON.stringify(user)}`);
    if (!user) throw CustomError.notFound(`User with ID ${id} not found`);
    const updatedUser: UserEntity = {
      ...user,
      ...updateUserDto,
      timestamp: new Date().toISOString(),
    };
    const options: QueryOptions = {
      name: "update-user",
      text: `
        UPDATE users
        SET
            name = COALESCE($2, name),
            surname = COALESCE($3, surname),
            gender = COALESCE($4, gender),
            email = COALESCE($5, email),
            phone = COALESCE($6, phone),
            rol = COALESCE($7, rol),
            password = COALESCE($8, password),
            is_disabled = COALESCE($9, is_disabled),
            is_verified = COALESCE($10, is_verified),
            nickname = COALESCE($11, nickname),
            timestamp = $12
        WHERE id = $1
        RETURNING *;
      `,
      values: [
        updatedUser.id, // $1: ID
        updatedUser.name, // $2: Name
        updatedUser.surname, // $3: Surname
        updatedUser.gender, // $4: Gender
        updatedUser.email, // $5: Email
        updatedUser.phone, // $6: Phone
        updatedUser.rol, // $7: Role
        updatedUser.password, // $8: Password
        updatedUser.is_disabled, // $9: Is Disabled
        updatedUser.is_verified, // $10: Is Verified
        updatedUser.nickname, // $11: Nickname
        updatedUser.timestamp, // $12: Timestamp
      ],
    };

    const [userUpdated] = await this.executeTransaction(options);
    if (!userUpdated)
      throw CustomError.internalServerError("Error updating user");
    return UserEntityMapper.userEntityFromObject(userUpdated);
  }

  async delete(id: string): Promise<UserEntity> {
    const user: UserEntity | undefined = await this.findById(id);
    if (!user) throw CustomError.notFound(`User with ID ${id} not found`);
    const options: QueryOptions = {
      name: "delete-user",
      text: `DELETE FROM users WHERE id = $1 RETURNING *;`,
      values: [user.id],
    };
    const [userDeleted] = await this.executeQuery(options);
    if (!userDeleted)
      throw CustomError.internalServerError("Error deleting user");
    return UserEntityMapper.userEntityFromObject(userDeleted);
  }
}
