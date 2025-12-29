export default interface Hasher {
    hash(password: string): { passwordHash: string; salt: string };
}