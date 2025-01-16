import { Gender, Roles } from "../../domain";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public gender: Gender,
    public email: string,
    public phone: string,
    public rol: Roles = Roles.user,
    public password: string,
    public is_verified: boolean,
    public is_disabled: boolean,
    public timestamp: string,
    public registration_date: string,
    public surname?: string,
    public nickname?: string
  ) {}
}
