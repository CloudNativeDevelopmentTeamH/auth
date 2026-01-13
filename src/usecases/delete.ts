import type DeleteUserUseCase from "./ports/inbound/delete.ts";
import UnauthorizedError from "./errors/unauthorized.ts";
import type TokenService from "./ports/outbound/token-service.ts";
import type UserRepository from "./ports/outbound/user-repository.ts";

export default class DeleteUser implements DeleteUserUseCase {
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