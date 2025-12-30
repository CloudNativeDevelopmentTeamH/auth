import UnauthorizedError from "./errors/unauthorized";
import type TokenService from "./ports/token-service";
import type UserRepository from "./ports/user-repository";

export default class DeleteUser {
    constructor(
        private userRepository: UserRepository,
        private tokenService: TokenService
    ) {}

    async execute(token?: string): Promise<void> {
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        const user = this.tokenService.verifyToken(token);
        if (!user) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        await this.userRepository.deleteById(user.id);
    }
}