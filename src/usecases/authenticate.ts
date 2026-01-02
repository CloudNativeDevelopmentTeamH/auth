import UnauthorizedError from "./errors/unauthorized";
import type TokenService from "./ports/outbound/token-service";

export default class AuthenticateUser {
    constructor(private tokenService: TokenService) {}

    async execute(token?: string): Promise<number> {
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        const userId = this.tokenService.verifyToken(token);
        if (!userId) {
            throw new UnauthorizedError("Invalid or expired token");
        }
        return userId;
    }
}