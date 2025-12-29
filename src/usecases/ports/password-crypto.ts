export default interface PasswordCrypto {
    hash(password: string): { passwordHash: string; salt: string };
    compare(password: string, passwordHash: string, salt: string): boolean;
}