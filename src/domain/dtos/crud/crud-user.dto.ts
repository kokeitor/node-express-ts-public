import { Gender, Roles } from "../../../domain";
import { BcryptAdapter } from "../../../adapters";
import { validateUser, validatePartialUser } from "../../../config";
import { logger } from "../../../app";

export class CreateUserDto {
  private constructor(
    public name: string,
    public surname: string,
    public nickname: string,
    public rol: Roles,
    public gender: Gender,
    public email: string,
    public phone: string,
    public password: string,
    public is_verified: boolean,
    public is_disabled: boolean
  ) {}

  static create(
    object: { [key: string]: unknown } // or Record<string, any>
  ): [string | undefined, CreateUserDto?] {
    const {
      name,
      surname,
      nickname,
      rol,
      gender,
      email,
      phone,
      password,
      is_verified,
      is_disabled,
    } = object;

    if (!name || !gender || !email || !phone || !password || !rol) {
      logger.error(
        `Error validating user creation data, some register dto props are missing in :  ${JSON.stringify(
          object
        )}`
      );
      return [
        "Error validating user data. Missing user properties.",
        undefined,
      ];
    }

    // validate correct format and types of data
    const result = validateUser({
      name,
      surname,
      nickname,
      rol,
      gender,
      email,
      phone,
      password,
      is_verified,
      is_disabled,
    });

    if (!result.success) {
      logger.error(`Error validating user creation data: ${result.error}`);
      // return ["Error validating user data. Check the data format.", undefined];// PRO
      return [JSON.stringify(result.error), undefined]; // DEV
    }

    return [
      undefined,
      new CreateUserDto(
        name as string,
        surname ? (surname as string) : "N/A",
        nickname ? (nickname as string) : "N/A",
        rol as Roles,
        gender as Gender,
        email as string,
        phone as string,
        BcryptAdapter.hash(password as string),
        (is_verified as boolean) ?? false,
        (is_disabled as boolean) ?? false
      ),
    ];
  }
}

export class UpdateUserDto {
  private constructor(
    public name?: string,
    public surname?: string,
    public nickname?: string,
    public rol?: Roles,
    public gender?: Gender,
    public email?: string,
    public phone?: string,
    public password?: string,
    public is_verified?: boolean,
    public is_disabled?: boolean
  ) {}

  static create(
    object: Record<string, unknown>
  ): [string | undefined, UpdateUserDto?] {
    // Validar el caso de datos vacíos {}
    if (Object.keys(object).length === 0) {
      return ["No data provided to update the user", undefined];
    }
    const {
      name,
      surname,
      nickname,
      rol,
      gender,
      email,
      phone,
      password,
      is_verified,
      is_disabled,
    } = object;

    const result = validatePartialUser(object);

    if (!result.success) {
      logger.error(`Error validating user update data: ${result.error}`);
      // return ["Error validating user data. Check the data format.", undefined];// PRO
      return [JSON.stringify(result.error), undefined]; // DEV
    }

    logger.info(
      `Data to update : ${JSON.stringify({
        name,
        surname,
        nickname,
        rol,
        gender,
        email,
        phone,
        password,
        is_verified,
        is_disabled,
      })}`
    );
    let hash_password: string | undefined;
    if (!password) {
      hash_password = undefined;
    } else {
      hash_password = BcryptAdapter.hash(password as string);
    }
    return [
      undefined,
      new UpdateUserDto(
        name as string,
        surname as string,
        nickname as string,
        rol as Roles,
        gender as Gender,
        email as string,
        phone as string,
        hash_password,
        is_verified as boolean,
        is_disabled as boolean
      ),
    ];
  }
}
