import { Gender, Roles } from "../../../domain";
import { BcryptAdapter } from "../../../adapters";
import { validatePartialUser } from "../../../config";
import { logger } from "../../../app";

export class RegisterUserDto {
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
    object: Record<string, unknown>
  ): [string | undefined, RegisterUserDto?] {
    // extract only name, surname, nickname, gender, email, phone, password from object (body)
    const { name, surname, nickname, gender, email, phone, password } = object;

    if (!name || !gender || !email || !phone || !password) {
      logger.error(
        `Error validating user register data, some register dto props are missing in :  ${JSON.stringify(
          object
        )}`
      );
      return [
        "Error validating user data. Missing user properties.",
        undefined,
      ];
    }

    // validate correct format and types of data
    const result = validatePartialUser({
      name,
      surname,
      nickname,
      gender,
      email,
      phone,
      password,
    });

    if (!result.success) {
      logger.error(`Error validating user register data: ${result.error}`);
      // return ["Error validating user data. Check the data format.", undefined];// PRO
      return [JSON.stringify(result.error), undefined]; // DEV
    }

    return [
      undefined,
      new RegisterUserDto(
        name as string,
        surname ? (surname as string) : "N/A",
        nickname ? (nickname as string) : "N/A",
        Roles.user,
        gender as Gender,
        email as string,
        phone as string,
        BcryptAdapter.hash(password as string),
        false,
        false
      ),
    ];
  }
}
