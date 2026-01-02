import ArgonPasswordCrypto from "../auth/argon-password-crypto";
import JwtTokenService from "../auth/jwt-token-service";
import PostgresUserRepository from "../persistence/postgres-user-repository";

export default {
  user: PostgresUserRepository,
  token: JwtTokenService,
  crypto: ArgonPasswordCrypto
}