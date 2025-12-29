import User from "./User";

export default class AuthUser extends User {
    passwordHash!: string;
    salt!: string;

    constructor(id: number, name: string, email: string, passwordHash: string, salt: string) {
        super(id, name, email);
        this.passwordHash = passwordHash;
        this.salt = salt;
    }
}