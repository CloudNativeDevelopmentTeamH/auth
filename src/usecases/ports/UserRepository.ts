import type AuthUser from "../../entities/AuthUser";
import User from "../../entities/User";

export default interface UserRepository {
    getById(id: number): Promise<User>; // logged in, user must exist
    findByEmail(email: string): Promise<AuthUser | null>; // for login, may not exist
    save(user: AuthUser): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<boolean>;
}