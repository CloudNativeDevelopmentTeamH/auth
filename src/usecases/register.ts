
import User from "../entities/user";
import type { NewAuthUser } from "../entities/auth-user";
import type RegisterUserInputDTO from "./dtos/register-user-input";

import type PasswordCrypto from "./ports/password-crypto";
import type UserRepository from "./ports/user-repository";
import type Validator from "./ports/validator";

import ValidationError from "./errors/validation";
import ConflictError from "./errors/conflict";

export default class RegisterUser {
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
            throw new ConflictError("User already exists");
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