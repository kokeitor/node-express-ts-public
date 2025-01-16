// Enumeración de género
export enum Gender {
  male = "hombre",
  female = "mujer",
}

export enum Roles {
  user = "USER",
  admin = "ADMIN",
}

export interface ValidatedUser {
  id?: string;
  name: string;
  surname?: string;
  nickname?: string;
  rol?: Roles;
  gender: Gender;
  email: string;
  phone: string;
  password: string;
  is_verified?: boolean;
  is_disable?: boolean;
}

export interface ValidatedPartialUser {
  id?: string;
  name?: string;
  surname?: string;
  nickname?: string;
  rol?: Roles;
  gender?: Gender;
  email?: string;
  phone?: string;
  password?: string;
  is_verified?: boolean;
  is_disable?: boolean;
}
