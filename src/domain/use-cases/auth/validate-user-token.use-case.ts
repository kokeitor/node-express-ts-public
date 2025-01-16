import {
  AuthRepository,
  CustomError,
  UserToken,
  VerifyToken,
  SendEmailVerificationUseCase,
  IValidateUserTokenUseCase,
} from "../../../domain";
import { JwtAdapter, ResendAdapter } from "../../../adapters";
import { logger } from "../../../app";

export class ValidateUserTokenUseCase implements IValidateUserTokenUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly verifyToken: VerifyToken = JwtAdapter.verifyToken
  ) {}

  execute = async (token: string): Promise<UserToken> => {
    // decode token
    const data = await this.verifyToken<{ id: string }>(token);

    if (!data) {
      logger.error(
        `Error in verifying token inside validate User Token use case >> ${token}`
      );
      throw CustomError.unauthorized("Unauthorized, invalid token");
    }

    // call verify method from repository instance
    const { id } = data;
    if (!id) throw CustomError.unauthorized("Unauthorized, invalid token");
    const user = await this.repository.findById(id!);

    if (!user) {
      throw CustomError.notFound(`User with ID : ${id} does not exist`);
    }

    // check if user is disabled
    if (user.is_disabled) {
      throw CustomError.forbidden(`User with ID : ${id} is disabled`);
    }

    // check if user is verified ?? send verification email
    if (!user.is_verified) {
      const emailResult = await new SendEmailVerificationUseCase(
        new ResendAdapter()
      ).execute(user, token as string);
      if (!emailResult)
        throw CustomError.internalServerError(
          "Error sending email verification"
        );
      throw CustomError.forbidden(
        "user is not verified. Email verification required"
      );
    }

    return {
      token: token as string,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
    };
  };
}
