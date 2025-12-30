import type User from "../../entities/user";

export default interface TokenGenerator {
    generate(payload: User): string;
}