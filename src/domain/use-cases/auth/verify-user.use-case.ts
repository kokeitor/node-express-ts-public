import {
  AuthRepository,
  CustomError,
  UserToken,
  IVerifyUserUseCase,
  VerifyToken,
} from "../../../domain";
import { JwtAdapter } from "../../../adapters";
import { logger } from "../../../app";

export class VerifyUserUseCase implements IVerifyUserUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly verifyToken: VerifyToken = JwtAdapter.verifyToken
  ) {}

  execute = async (token: string): Promise<UserToken> => {
    // decode token
    const data = await this.verifyToken<{ id: string }>(token);

    if (!data) {
      logger.error(
        `Error in verifying token inside verify User use case >> ${token}`
      );
      throw CustomError.unauthorized("Unauthorized, invalid token");
    }

    // call verify method from repository instance
    const { id } = data;
    const user = await this.repository.verify(id);
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
