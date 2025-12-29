import type UserRepository from "./ports/userRepository";

export default class LoginUser {
    constructor(
        private userRepository: UserRepository
    ) {}
}