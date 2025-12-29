import type LoginUserDto from "./dtos/login-user";
import ValidationError from "./errors/validation";
import type PasswordCrypto from "./ports/password-crypto";
import type TokenService from "./ports/token-service";
import type UserRepository from "./ports/user-repository";
import type Validator from "./ports/validator";

export default class LoginUser {
    constructor(
        private userRepository: UserRepository,
        private validator: Validator<LoginUserDto>,
        private crypto: PasswordCrypto,
        private tokenService: TokenService
    ) {}

    async execute(payload: LoginUserDto): Promise<string> {
        const { data, errors } = this.validator.validate(payload);
        if (errors && errors.length > 0) {
            throw new ValidationError("Validation failed: " + errors.join(", "));   
        }

        const user = await this.userRepository.findByEmail(data.email);
        const isPasswordValid = user ? this.crypto.compare(data.password, user.password, user.salt) : false;
        
        if (user && isPasswordValid) {
            return this.tokenService.generate(user);
        }
        else {
            throw new Error("Invalid credentials");
        }
    }
}