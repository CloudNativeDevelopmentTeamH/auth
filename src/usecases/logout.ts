import type LogoutUserUseCase from "./ports/inbound/logout.ts";
import UnauthorizedError from "./errors/unauthorized.ts";
import type TokenService from "./ports/outbound/token-service.ts";

export default class LogoutUser implements LogoutUserUseCase {
  constructor(private tokenService: TokenService) {}

  async execute(token?: string): Promise<void> {
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    this.tokenService.invalidateToken(token);
  }
}