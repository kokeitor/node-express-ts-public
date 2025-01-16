import {
  AuthRepository,
  LoginUserDto,
  GenerateToken,
  CustomError,
  UserToken,
  ILoginUserUseCase,
  SendEmailVerificationUseCase,
} from "../../../domain";
import { JwtAdapter, ResendAdapter } from "../../../adapters";

export class LoginUserUseCase implements ILoginUserUseCase {
  private readonly repository: AuthRepository;
  private readonly generateToken: GenerateToken = JwtAdapter.generateToken;

  constructor(repository: AuthRepository, generateToken: GenerateToken) {
    this.repository = repository;
    this.generateToken = generateToken;
  }

  execute = async (loginUserDto: LoginUserDto): Promise<UserToken> => {
    // call login method from repository
    const user = await this.repository.login(loginUserDto);

    // generate JWT token
    const token: string | null = await this.generateToken(
      {
        id: user.id,
      },
      "1h"
    );
    if (!token) throw CustomError.internalServerError("Error generating token");

    // send emmail verification use case if user is not verified
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
