import type { NewAuthUser } from "../../entities/auth-user";
import type AuthUser from "../../entities/auth-user";
import type User from "../../entities/user";
import type UserRepository from "../../usecases/ports/user-repository";

export default class PostgresUserRepository implements UserRepository {
    async getById(id: number): Promise<User> {
        return Promise.resolve({} as User);
    }
    
    async findByEmail(email: string): Promise<AuthUser | null> {
        return Promise.resolve(null);
    }

    async save(user: NewAuthUser): Promise<User> {
        return Promise.resolve({} as User);
    }

    async deleteById(id: number): Promise<boolean> {
        return Promise.resolve(true);
    }
}