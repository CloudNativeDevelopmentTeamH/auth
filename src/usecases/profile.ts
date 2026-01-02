import type FetchUserProfileUseCase from "./ports/inbound/profile";
import type User from "../entities/user";
import UnauthorizedError from "./errors/unauthorized";
import type TokenService from "./ports/outbound/token-service";

import type UserRepository from "./ports/outbound/user-repository";

export default class FetchUserProfile implements FetchUserProfileUseCase {
    constructor(
        private tokenService: TokenService,
        private userRepository: UserRepository,
    ) {}

    async execute(token?: string): Promise<User> {
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        const userId = this.tokenService.verifyToken(token);
        if (!userId) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        const user = await this.userRepository.getById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        return user;
    } 
}