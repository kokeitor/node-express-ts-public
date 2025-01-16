import { LoginUserDto, UserToken } from "../../../../domain";
export interface ILoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}
