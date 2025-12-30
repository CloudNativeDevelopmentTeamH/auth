import type User from "../entities/user";
import type TokenService from "./ports/token-service";
import UnauthorizedError from "./errors/unauthorized";

export default class AuthorizeUser {
    constructor(private tokenService: TokenService) {}

    async execute(token: string): Promise<void> {
        const user: User | null = this.tokenService.verifyToken(token);
        if (!user) {
            throw new UnauthorizedError("Invalid or expired token");
        }
    }
}