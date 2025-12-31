import type PasswordCrypto from "../../usecases/ports/password-crypto";

import * as argon2 from "argon2";


export default class ArgonPasswordCrypto implements PasswordCrypto {
    async hash(password: string): Promise<string> {
        const passwordHash = await argon2.hash(password); 
        return passwordHash;
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        const isMatch = await argon2.verify(passwordHash, password);
        return isMatch;
    }
}