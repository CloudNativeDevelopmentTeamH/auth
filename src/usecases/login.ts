import type LoginUserUseCase from "./ports/inbound/login.ts";
import type LoginUserInputDTO from "./dtos/login-user-input.ts";

import type PasswordCrypto from "./ports/outbound/password-crypto.ts";
import type TokenService from "./ports/outbound/token-service.ts";
import type UserRepository from "./ports/outbound/user-repository.ts";
import type Validator from "./ports/outbound/validator.ts";

import UnauthorizedError from "./errors/unauthorized.ts";
import ValidationError from "./errors/validation.ts";

export default class LoginUser implements LoginUserUseCase {
  constructor(
        private userRepository: UserRepository,
        private validator: Validator<LoginUserInputDTO>,
        private crypto: PasswordCrypto,
        private tokenService: TokenService
  ) {}

  async execute(payload: LoginUserInputDTO): Promise<string> {
    const { data, errors } = this.validator.validate(payload);
    if (errors && errors.length > 0) {
      throw new ValidationError("Validation failed: " + errors.join(", "));   
    }

    const user = await this.userRepository.findByEmail(data.email);
    const isPasswordValid = user ? await this.crypto.compare(data.password, user.password) : false;
        
    if (user && isPasswordValid) {
      return this.tokenService.issueToken(user);
    }
    else {
      throw new UnauthorizedError("Invalid email or password");
    }
  }
}