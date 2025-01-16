import jwt, { SignOptions } from "jsonwebtoken";
import { logger, envs } from "../app";

export class JwtAdapter {
  static generateToken(
    payload: object,
    duration: string = "1h"
  ): Promise<string | null> {
    const options: SignOptions = {
      expiresIn: duration,
      algorithm: "HS256",
    };
    return new Promise<string | null>((resolve) => {
      jwt.sign(
        payload,
        envs.jwtSecret,
        options,
        (err: Error | null, token?: string): void => {
          if (err) {
            logger.error(
              `Error in generating token inside generateToken method >> ${err}`
            );
            return resolve(null);
          }
          if (!token) {
            logger.error("Token generation failed for unknown reasons.");
            return resolve(null);
          }
          logger.info(`Token generated: ${token}`);
          resolve(token);
        }
      );
    });
  }

  static verifyToken<T>(token: string): Promise<T | null> {
    return new Promise<T | null>((resolve) => {
      jwt.verify(
        token,
        envs.jwtSecret,
        (
          err: Error | null,
          decoded: jwt.JwtPayload | string | undefined
        ): void => {
          if (err) {
            logger.error(
              `Error in verifying token inside verifyToken method >> ${err}`
            );
            return resolve(null);
          }
          if (!decoded) {
            logger.error("Token verification failed for unknown reasons.");
            return resolve(null);
          }
          resolve(decoded as T);
        }
      );
    });
  }
}
