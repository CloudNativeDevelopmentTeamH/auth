import { it, expect, beforeEach } from "vitest";
import { MockUserRepository, MockValidator, MockPasswordCrypto, MockTokenService } from "../mocks/mocks";
import type LoginUserInputDTO from "../../src/usecases/dtos/login-user-input";
import LoginUser from "../../src/usecases/login";
import type Validator from "../../src/usecases/ports/outbound/validator";
import type { ValidatorResult } from "../../src/usecases/ports/outbound/validator";

let userRepository: MockUserRepository;
let validator: MockValidator<LoginUserInputDTO>;
let crypto: MockPasswordCrypto;
let tokenService: MockTokenService;
let loginUser: LoginUser;

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password1234"
}

beforeEach(async () => {
  userRepository = new MockUserRepository();
  validator = new MockValidator<LoginUserInputDTO>();
  crypto = new MockPasswordCrypto();
  tokenService = new MockTokenService();
  loginUser = new LoginUser(userRepository, validator, crypto, tokenService);

  await userRepository.save({
    name: testUser.name,
    email: testUser.email,
    password: await crypto.hash(testUser.password)
  });
});

it("returns token when credentials are valid", async () => {
  const payload: LoginUserInputDTO = {
    email: testUser.email,
    password: testUser.password
  };
  const token = await loginUser.execute(payload);
  const user = await userRepository.findByEmail(testUser.email);
  expect(token).toBe(`mocked_token_for_user_${user?.id}`);
});

it("throws UnauthorizedError when credentials are invalid", async () => {
  const payload: LoginUserInputDTO = {
    email: testUser.email,
    password: "wrong_password"
  };

  await expect(loginUser.execute(payload)).rejects.toThrow("Invalid email or password");
});

it("throws ValidationError when input is invalid", async () => {
  class MockValidatorWithErrors<T> implements Validator<T> {
    validate(data: T): ValidatorResult<T> {
      return {
        data,
        errors: ["Invalid email format"]
      };
    }
  }
  
  const validatorWithErrors = new MockValidatorWithErrors<LoginUserInputDTO>();
  const loginUserWithInvalidInput = new LoginUser(userRepository, validatorWithErrors, crypto, tokenService);
  
  const payload: LoginUserInputDTO = {
    email: "invalid_email",
    password: "password"
  };
  await expect(loginUserWithInvalidInput.execute(payload)).rejects.toThrow("Validation failed: Invalid email format");
});