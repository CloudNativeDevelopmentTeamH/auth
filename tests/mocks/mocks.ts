/* eslint-disable @typescript-eslint/no-unused-vars */
import type AuthUser from "../../src/entities/auth-user";
import type { NewAuthUser } from "../../src/entities/auth-user";
import type User from "../../src/entities/user";
import type PasswordCrypto from "../../src/usecases/ports/outbound/password-crypto";
import type UserRepository from "../../src/usecases/ports/outbound/user-repository";
import type Validator from "../../src/usecases/ports/outbound/validator";
import type { ValidatorResult } from "../../src/usecases/ports/outbound/validator";
import type TokenService from "../../src/usecases/ports/outbound/token-service";

const testUserInput = {
  email: "test@example.com",
  password: "password"
};

const testUserStored: AuthUser = {
  id: 1,
  name: testUserInput.email,
  email: testUserInput.email,
  password: "hashed_password"
};

class MockUserRepository implements UserRepository {
  save(user: NewAuthUser): Promise<User> {
    const newUser: User = {
      id: 1,
      ...user,
    }
    return Promise.resolve(newUser);
  }

  getById(id: number): Promise<User | null> {
    const user: User = {
      id,
      name: testUserStored.name,
      email: testUserStored.email
    }
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<AuthUser | null> {
    if (email !== testUserStored.email) {
      return Promise.resolve(null);
    }
    return Promise.resolve(testUserStored);
  }

   
  deleteById(id: number): Promise<boolean> {
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
  issueToken(user: AuthUser): string {
    return "mocked_token_for_user_" + user.id;
  }

  verifyToken(token: string): number | null {
    const match = token.match(/mocked_token_for_user_(\d+)/);
    return match ? parseInt(match[1]!, 10) : null;
  }

  invalidateToken(token: string): void {
    // No-op for mock
  }
}

export {
  testUserInput,
  testUserStored,
  MockUserRepository,
  MockValidator,
  MockPasswordCrypto,
  MockTokenService
}