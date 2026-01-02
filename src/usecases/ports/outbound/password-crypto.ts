export default interface PasswordCrypto {
    hash(password: string): Promise<string>;
    compare(password: string, passwordHash: string): Promise<boolean>;
}