import { JwtAdapter, ResendAdapter } from "../../../adapters";
import {
  CustomError,
  AuthRepository,
  RegisterUserDto,
  SendEmailVerificationUseCase,
  UserToken,
  IRegisterUserUseCase,
  GenerateToken,
} from "../../../domain";

export class RegisterUserUseCAse implements IRegisterUserUseCase {
  private readonly repository: AuthRepository;
  private readonly generateToken: GenerateToken = JwtAdapter.generateToken;

  constructor(repository: AuthRepository, generateToken: GenerateToken) {
    this.repository = repository;
    this.generateToken = generateToken;
  }
  execute = async (registerUserDto: RegisterUserDto): Promise<UserToken> => {
    // register user
    const registeredUser = await this.repository.register(registerUserDto);

    // generate JWT token
    const token: string | null = await this.generateToken(
      {
        id: registeredUser.id,
      },
      "1h"
    );
    if (!token) throw CustomError.internalServerError("Error generating token");

    // send emmail verification
    const emailResult = await new SendEmailVerificationUseCase(
      new ResendAdapter()
    ).execute(registeredUser, token as string);
    if (!emailResult)
      throw CustomError.internalServerError("Error sending email verification");

    return {
      token: token as string,
      user: {
        id: registeredUser.id,
        email: registeredUser.email,
        rol: registeredUser.rol,
      },
    };
  };
}
