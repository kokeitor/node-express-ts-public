import { UserEntity } from "../../../../domain";
export interface ISendEmailVerificationUseCase {
  execute(user: UserEntity, token: string): Promise<boolean>;
}
