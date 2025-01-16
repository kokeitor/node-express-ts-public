import { logger } from "../../../app";
import { validatePartialUser } from "../../../config";

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}

  static create(object: {
    [key: string]: string;
  }): [string | undefined, LoginUserDto?] {
    // extract only email and password from object (body)
    const { email, password } = object;

    if (!email || !password) {
      logger.error(`Missing email or password data while login a user`);
      // return ["Error validating user data. Check the data format.", undefined]; // PRO
      return ["Missing email or password data while login a user", undefined]; // DEV
    }

    // data format and types validation
    const result = validatePartialUser({ email, password });

    if (!result.success) {
      logger.error(`Error validating user login data: ${result.error}`);
      // return ["Error validating user data. Check the data format.", undefined]; // PRO
      return [JSON.stringify(result.error), undefined]; // DEV
    }

    return [undefined, new LoginUserDto(email.trim(), password)];
  }
}
