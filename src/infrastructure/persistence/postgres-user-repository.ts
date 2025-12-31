import type { NewAuthUser } from "../../entities/auth-user";
import type AuthUser from "../../entities/auth-user";
import type User from "../../entities/user";
import type UserRepository from "../../usecases/ports/user-repository";

import db from "./drizzle-client";
import usersTable from "./user-schema";
import { eq } from "drizzle-orm";

export default class PostgresUserRepository implements UserRepository {
    async getById(id: number): Promise<User | null> {
        const rows = await db
            .select({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
            })
            .from(usersTable)
            .where(eq(usersTable.id, id));

        if (!rows[0]) {
            return null
        }

        return rows[0] as User;
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