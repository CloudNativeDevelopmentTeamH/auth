import type User from "../../entities/user";

export default interface TokenService {
  issueToken(payload: User): string;
  verifyToken(token: string): number | null;
  invalidateToken(token: string): void;
}