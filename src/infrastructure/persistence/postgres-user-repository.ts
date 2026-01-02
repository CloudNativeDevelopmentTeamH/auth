import AuthUser from "../../entities/auth-user";
import NewAuthUser from "../../entities/auth-user";
import User from "../../entities/user";
import type UserRepository from "../../usecases/ports/outbound/user-repository";

import db from "./drizzle-client";
import usersTable from "./user-schema";
import { eq } from "drizzle-orm";

export default class PostgresUserRepository implements UserRepository {
    async save(user: NewAuthUser): Promise<User> {
        const rows = await db
            .insert(usersTable)
            .values({
                ...user
            })
            .returning({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
            });

        const row = rows[0]!; // no business throwing, driver should fail first

        return new User(row.id, row.name, row.email);
    }

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
                password: usersTable.password,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!rows[0]) {
            return null
        }
        const row = rows[0];

        return new AuthUser(row.id, row.name, row.email, row.password);
    }

    async deleteById(id: number): Promise<boolean> {
        const deletedUser = await db
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();

        if (deletedUser.length === 0) {
            return false;
        }
        return true;
    }
}