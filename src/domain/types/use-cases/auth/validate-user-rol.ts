import { UserToken, Session } from "../../..";
export interface IValidateRolUserUseCase {
  execute(session: Session): Promise<UserToken>;
}
