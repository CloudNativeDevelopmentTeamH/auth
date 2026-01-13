import type { NewAuthUser } from "../../../entities/auth-user.ts";
import type AuthUser from "../../../entities/auth-user.ts";
import type User from "../../../entities/user.ts";

export default interface UserRepository {
    save(user: NewAuthUser): Promise<User>;
    getById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<AuthUser | null>;
    deleteById(id: number): Promise<boolean>;
}