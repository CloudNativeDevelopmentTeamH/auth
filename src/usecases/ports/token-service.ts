import type User from "../../entities/user";

export default interface TokenService {
    issueToken(payload: User): string;
    verifyToken(token: string): User | null;
    invalidateToken(token: string): void;
}