/* eslint-disable @typescript-eslint/no-unused-vars */
import type AuthUser from "../../src/entities/auth-user";
import type { NewAuthUser } from "../../src/entities/auth-user";
import type User from "../../src/entities/user";
import type PasswordCrypto from "../../src/usecases/ports/outbound/password-crypto";
import type UserRepository from "../../src/usecases/ports/outbound/user-repository";
import type Validator from "../../src/usecases/ports/outbound/validator";
import type { ValidatorResult } from "../../src/usecases/ports/outbound/validator";
import type TokenService from "../../src/usecases/ports/outbound/token-service";

class MockUserRepository implements UserRepository {
  private users: AuthUser[] = [];
  private nextId = 1;

  save(user: NewAuthUser): Promise<User> {
    const newUser: AuthUser = {
      id: this.nextId++,
      ...user,
    }
    this.users.push(newUser);

    return Promise.resolve(newUser);
  }

  getById(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id) || null;
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<AuthUser | null> {
    const user = this.users.find(u => u.email === email) || null;
    return Promise.resolve(user);
  }
   
  deleteById(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.users.splice(index, 1);

    return Promise.resolve(true);
  }
}

class MockValidator<T> implements Validator<T> {
  validate(data: T): ValidatorResult<T> {
    return {
      data
    };
  }
}

class MockPasswordCrypto implements PasswordCrypto {
  hash(password: string): Promise<string> {
    return Promise.resolve("hashed_" + password);
  }

  compare(password: string, passwordHash: string): Promise<boolean> {
    console.log();
    return Promise.resolve(passwordHash === "hashed_" + password);
  }
}

class MockTokenService implements TokenService {
  private invalidatedTokens: Set<string> = new Set();

  issueToken(user: AuthUser): string {
    return "mocked_token_for_user_" + user.id;
  }

  verifyToken(token: string): number | null {
    if (this.invalidatedTokens.has(token)) {
      return null;
    }
    const match = token.match(/mocked_token_for_user_(\d+)/);
    return match ? parseInt(match[1]!, 10) : null;
  }

  invalidateToken(token: string): void {
    this.invalidatedTokens.add(token);
  }
}

export {
  MockUserRepository,
  MockValidator,
  MockPasswordCrypto,
  MockTokenService
}