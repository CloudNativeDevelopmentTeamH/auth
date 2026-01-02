import type LoginUserUseCase from "./ports/inbound/login";
import type LoginUserInputDTO from "./dtos/login-user-input";

import type PasswordCrypto from "./ports/outbound/password-crypto";
import type TokenService from "./ports/outbound/token-service";
import type UserRepository from "./ports/outbound/user-repository";
import type Validator from "./ports/outbound/validator";

import UnauthorizedError from "./errors/unauthorized";
import ValidationError from "./errors/validation";

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