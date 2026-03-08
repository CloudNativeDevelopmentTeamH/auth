import type RegisterUserUseCase from "./ports/inbound/register.ts";
import User from "../entities/user.ts";
import type { NewAuthUser } from "../entities/auth-user.ts";
import type RegisterUserInputDTO from "./dtos/register-user-input.ts";
import type UserRegisteredEvent from "./events/user-registered-event.ts";

import type PasswordCrypto from "./ports/outbound/password-crypto.ts";
import type UserRepository from "./ports/outbound/user-repository.ts";
import type Validator from "./ports/outbound/validator.ts";
import type EventPublisher from "./ports/outbound/event-publisher.ts";

import ValidationError from "./errors/validation.ts";
import ConflictError from "./errors/conflict.ts";
import { USER_REGISTERED } from "./events/events.ts";

export default class RegisterUser implements RegisterUserUseCase {
  constructor(
        private userRepository: UserRepository,
        private validator: Validator<RegisterUserInputDTO>,
        private crypto: PasswordCrypto,
        private eventPublisher: EventPublisher
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
    const user = await this.userRepository.save(newUser);

    const event: UserRegisteredEvent = {
      userId: user.id,
      name: user.name,
      email: user.email,
      registeredAt: new Date().toISOString(),
    };
    await this.eventPublisher.publish(USER_REGISTERED, event);

    return user;
  }
}