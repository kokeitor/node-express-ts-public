import { UserToken } from "../../../../domain";
export interface IVerifyUserUseCase {
  execute(token: string): Promise<UserToken>;
}

export type VerifyToken = <T>(token: string) => Promise<T | null>;
