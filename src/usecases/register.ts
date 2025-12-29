import type AuthUser from "../entities/AuthUser";
import User from "../entities/User";
import type UserRepository from "./ports/UserRepository";

export default class RegisterUser {
    constructor(
        private userRepository: UserRepository
    ) {}

    async execute(email: string, name: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const passwordHash = "hashed_" + password; // Simplified hashing
        const salt = ""; // Simplified salt

        const newUser: AuthUser = { id: 0, email, name, passwordHash, salt }; // Simplified user creation
        return this.userRepository.save(newUser);
    }
}