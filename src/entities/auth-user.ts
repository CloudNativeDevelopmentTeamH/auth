import User from "./user";

export default class AuthUser extends User {
    password!: string;
    salt!: string;

    constructor(id: number, name: string, email: string, password: string, salt: string) {
        super(id, name, email);
        this.password = password;
        this.salt = salt;
    }
}

export type NewAuthUser = Omit<AuthUser, "id">;