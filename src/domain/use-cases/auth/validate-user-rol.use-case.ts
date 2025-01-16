import {
  CustomError,
  UserToken,
  IValidateRolUserUseCase,
  Session,
} from "../../../domain";
import { logger } from "../../../app";

export class ValidateRolUserUseCase implements IValidateRolUserUseCase {
  execute = async (session: Session): Promise<UserToken> => {
    const sessionData = session.data;
    logger.info(`Session data email : ${sessionData.user.email}`);
    logger.info(`Session data rol : ${sessionData.user.rol}`);
    logger.info(`Session data user id : ${sessionData.user.id}`);

    if (!sessionData.user) {
      logger.error(`No session active`);
      throw CustomError.forbidden("Unauthorized, no session active");
    }
    if (sessionData.user.rol !== "ADMIN") {
      logger.error(`Invalid role provided in session`);
      throw CustomError.forbidden("Unauthorized, permission denied");
    }
    return {
      token: sessionData.token,
      user: {
        id: sessionData.user.id,
        email: sessionData.user.email,
        rol: sessionData.user.rol,
      },
    };
  };
}
