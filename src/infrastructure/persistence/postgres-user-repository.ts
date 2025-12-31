import type AuthUser from "../../entities/auth-user";
import type NewAuthUser from "../../entities/auth-user";
import User from "../../entities/user";
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
            .where(eq(usersTable.id, id))
            .limit(1);
 
        if (!rows[0]) {
            return null;
        }
        const row = rows[0];

        return new User(row.id, row.name, row.email);
    }
    
    async findByEmail(email: string): Promise<AuthUser | null> {
         const rows = await db
            .select({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!rows[0]) {
            return null
        }

        return rows[0] as AuthUser;
    }

    async save(user: NewAuthUser): Promise<User> {
        const result = await db.insert(usersTable).values({
            ...user
        }).returning();

        return result[0] as User;
    }

    async deleteById(id: number): Promise<boolean> {
        return Promise.resolve(true);
    }
}