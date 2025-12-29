
import type { NewAuthUser } from "../entities/AuthUser";
import User from "../entities/User";
import type RegisterUserDTO from "./dtos/RegisterUserDTO";
import type Hasher from "./ports/hasher";
import type UserRepository from "./ports/userRepository";
import type Validator from "./ports/validator";

export default class RegisterUser {
    constructor(
        private userRepository: UserRepository,
        private validator: Validator<RegisterUserDTO>,
        private hasher: Hasher
    ) {}

    async execute(data: RegisterUserDTO): Promise<User> {
        const { data: validatedData, errors } = this.validator.validate(data);
        if (errors && errors.length > 0) {
            throw new Error("Validation failed: " + errors.join(", "));
        }

        const existingUser = await this.userRepository.findByEmail(validatedData.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const { passwordHash, salt } = this.hasher.hash(validatedData.password);

        const newUser: NewAuthUser = {
            email: validatedData.email,
            name: validatedData.name,
            password: passwordHash,
            salt 
        };
        return this.userRepository.save(newUser);
    }
}