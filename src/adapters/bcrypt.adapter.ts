import { hashSync, compareSync } from "bcrypt";

export class BcryptAdapter {
  static hash(password: string): string {
    return hashSync(password, 10);
  }
  static compare(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }
}
