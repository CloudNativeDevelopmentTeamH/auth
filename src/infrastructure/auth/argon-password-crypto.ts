import type PasswordCrypto from "../../usecases/ports/outbound/password-crypto";

import * as argon2 from "argon2";
import config from "../utils/config";

export default class ArgonPasswordCrypto implements PasswordCrypto {
  private secret(): Buffer {
    return Buffer.from(config.pepper, "utf8");
  }

  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      secret: this.secret(),
    });
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return argon2.verify(passwordHash, password, {
      secret: this.secret(),
    });
  }
}