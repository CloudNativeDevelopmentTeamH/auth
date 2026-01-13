import User from "./user.ts";

export default class AuthUser extends User {
  password!: string;

  constructor(id: number, name: string, email: string, password: string) {
    super(id, name, email);
    this.password = password;
  }
}

export type NewAuthUser = Omit<AuthUser, "id">;