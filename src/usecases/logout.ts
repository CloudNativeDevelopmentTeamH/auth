import type TokenService from "./ports/token-service";

export default class LogoutUser {
    constructor(private tokenService: TokenService) {}

    async execute(token: string): Promise<void> {
        this.tokenService.invalidateToken(token);
    }
}