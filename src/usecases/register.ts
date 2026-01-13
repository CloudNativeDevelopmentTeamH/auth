import type RegisterUserUseCase from "./ports/inbound/register.ts";
import User from "../entities/user.ts";
import type { NewAuthUser } from "../entities/auth-user.ts";
import type RegisterUserInputDTO from "./dtos/register-user-input.ts";

import type PasswordCrypto from "./ports/outbound/password-crypto.ts";
import type UserRepository from "./ports/outbound/user-repository.ts";
import type Validator from "./ports/outbound/validator.ts";

import ValidationError from "./errors/validation.ts";
import ConflictError from "./errors/conflict.ts";

export default class RegisterUser implements RegisterUserUseCase {
  constructor(
        private userRepository: UserRepository,
        private validator: Validator<RegisterUserInputDTO>,
        private crypto: PasswordCrypto
  ) {}

  async execute(payload: RegisterUserInputDTO): Promise<User> {
    const { data: validatedData, errors } = this.validator.validate(payload);
    if (errors && errors.length > 0) {
      throw new ValidationError("Validation failed: " + errors.join(", "));
    }

    const existingUser = await this.userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const passwordHash = await this.crypto.hash(validatedData.password);

    const newUser: NewAuthUser = {
      email: validatedData.email,
      name: validatedData.name,
      password: passwordHash,
    };
    return this.userRepository.save(newUser);
  }
}