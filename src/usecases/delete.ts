import type UserRepository from "./ports/user-repository";

export default class DeleteUser {
    constructor(
        private userRepository: UserRepository,
    ) {}

    async execute(userId: number): Promise<void> {
        await this.userRepository.deleteById(userId);
    }
}