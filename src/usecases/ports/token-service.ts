import type User from "../../entities/User";

export default interface TokenGenerator {
    generate(payload: User): string;
}