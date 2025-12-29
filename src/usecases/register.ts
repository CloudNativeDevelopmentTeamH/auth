
import User from "../entities/User";
import type { NewAuthUser } from "../entities/AuthUser";
import type RegisterUserDto from "./dtos/register-user";
import type PasswordCrypto from "./ports/password-crypto";
import type UserRepository from "./ports/user-repository";
import type Validator from "./ports/validator";
import ValidationError from "./errors/validation";
import ConflictError from "./errors/conflict";

export default class RegisterUser {
    constructor(
        private userRepository: UserRepository,
        private validator: Validator<RegisterUserDto>,
        private crypto: PasswordCrypto
    ) {}

    async execute(payload: RegisterUserDto): Promise<User> {
        const { data: validatedData, errors } = this.validator.validate(payload);
        if (errors && errors.length > 0) {
            throw new ValidationError("Validation failed: " + errors.join(", "));
        }

        const existingUser = await this.userRepository.findByEmail(validatedData.email);
        if (existingUser) {
            throw new ConflictError("User already exists");
        }

        const { passwordHash, salt } = this.crypto.hash(validatedData.password);

        const newUser: NewAuthUser = {
            email: validatedData.email,
            name: validatedData.name,
            password: passwordHash,
            salt 
        };
        return this.userRepository.save(newUser);
    }
}