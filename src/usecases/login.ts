import type UserRepository from "./ports/UserRepository";

export default class LoginUser {
    constructor(
        private userRepository: UserRepository
    ) {}
}