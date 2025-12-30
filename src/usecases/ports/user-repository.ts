import type { NewAuthUser } from "../../entities/auth-user";
import type AuthUser from "../../entities/auth-user";
import User from "../../entities/user";

export default interface UserRepository {
    getById(id: number): Promise<User>; // logged in, user must exist
    findByEmail(email: string): Promise<AuthUser | null>; // for login, may not exist
    save(user: NewAuthUser): Promise<User>;
    deleteById(id: number): Promise<boolean>;
}