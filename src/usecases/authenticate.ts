import type AuthenticateUserUseCase from "./ports/inbound/authenticate.ts";
import UnauthorizedError from "./errors/unauthorized.ts";
import type TokenService from "./ports/outbound/token-service.ts";

export default class AuthenticateUser implements AuthenticateUserUseCase {
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