import type TokenService from "../../usecases/ports/outbound/token-service";
import type User from "../../entities/user";

import jwt from "jsonwebtoken";
import config from "../utils/config";

export default class JwtTokenService implements TokenService {
  private privateKey = config.jwtSecret;

  issueToken(payload: User): string {
    const token = jwt.sign(
      { id: payload.id},
      this.privateKey,
      { expiresIn: '24h' }
    );

    return token;
  }

  verifyToken(token: string): number | null {
    try {
      const decoded = jwt.verify(token, this.privateKey) as { id: number };
      const id = decoded.id;

      if (!id) {
        return null;
      }

      return id;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  invalidateToken(_token: string): void {
    // Stateless JWTs cannot be invalidated server-side without state (blacklist/denylist).
    // Use short TTLs + refresh tokens, or implement a token blacklist using jti.
  }
}