import type LogoutUserUseCase from "./ports/inbound/logout";
import UnauthorizedError from "./errors/unauthorized";
import type TokenService from "./ports/outbound/token-service";

export default class LogoutUser implements LogoutUserUseCase {
  constructor(private tokenService: TokenService) {}

  async execute(token?: string): Promise<void> {
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    this.tokenService.invalidateToken(token);
  }
}