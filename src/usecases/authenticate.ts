import type User from "../entities/user";
import UnauthorizedError from "./errors/unauthorized";
import type TokenService from "./ports/token-service";

export default class AuthenticateUser {
    constructor(private tokenService: TokenService) {}

    async execute(token?: string): Promise<User> {
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        const user = this.tokenService.verifyToken(token);
        if (!user) {
            throw new UnauthorizedError("Invalid or expired token");
        }
        return user;
    }
}