import { UserEntity, CustomError, Gender, Roles } from "../../domain";

export class UserEntityMapper {
  static userEntityFromObject(object: { [key: string]: unknown }): UserEntity {
    const {
      id,
      name,
      gender,
      email,
      phone,
      rol,
      password,
      is_verified,
      is_disabled,
      timestamp,
      registration_date,
      surname,
      nickname,
    } = object;

    // Validación de campos requeridos
    if (
      !id ||
      !name ||
      !gender ||
      !email ||
      !phone ||
      !rol ||
      !nickname ||
      !surname ||
      !password ||
      typeof is_verified == "undefined" ||
      typeof is_disabled == "undefined" ||
      !timestamp ||
      !registration_date
    ) {
      throw CustomError.badRequest("Error mapping object to User Entity");
    }

    return new UserEntity(
      id as string,
      name as string,
      gender as Gender,
      email as string,
      phone as string,
      rol as Roles,
      password as string,
      is_verified as boolean, // is_verified
      is_disabled as boolean, // is_disabled
      timestamp as string,
      registration_date as string,
      surname as string,
      nickname as string
    );
  }
}
