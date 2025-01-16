import { RegisterUserDto, UserToken } from "../../../../domain";

export interface IRegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

export type GenerateToken = (
  payload: object,
  duration?: string
) => Promise<string | null>;
