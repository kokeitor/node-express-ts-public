import { UserToken } from "../../../../domain";
export interface IValidateUserTokenUseCase {
  execute(token: string): Promise<UserToken>;
}
