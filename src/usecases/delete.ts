import UnauthorizedError from "./errors/unauthorized";
import type TokenService from "./ports/outbound/token-service";
import type UserRepository from "./ports/outbound/user-repository";

export default class DeleteUser {
    constructor(
        private userRepository: UserRepository,
        private tokenService: TokenService
    ) {}

    async execute(token?: string): Promise<void> {
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        const userId = this.tokenService.verifyToken(token);
        if (!userId) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        await this.userRepository.deleteById(userId);
    }
}