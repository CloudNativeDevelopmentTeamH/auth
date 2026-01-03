import { it, expect, beforeEach } from "vitest";
import { testUserInput, testUserStored, MockUserRepository, MockValidator, MockPasswordCrypto, MockTokenService } from "../mocks/mocks";
import type LoginUserInputDTO from "../../src/usecases/dtos/login-user-input";
import LoginUser from "../../src/usecases/login";
import type Validator from "../../src/usecases/ports/outbound/validator";
import type { ValidatorResult } from "../../src/usecases/ports/outbound/validator";

let userRepository: MockUserRepository;
let validator: MockValidator<LoginUserInputDTO>;
let crypto: MockPasswordCrypto;
let tokenService: MockTokenService;
let loginUser: LoginUser;

beforeEach(() => {
  userRepository = new MockUserRepository();
  validator = new MockValidator<LoginUserInputDTO>();
  crypto = new MockPasswordCrypto();
  tokenService = new MockTokenService();
  loginUser = new LoginUser(userRepository, validator, crypto, tokenService);
});

it("returns token when credentials are valid", async () => {
  const payload: LoginUserInputDTO = {
    email: testUserInput.email,
    password: testUserInput.password
  };

  const token = await loginUser.execute(payload);
  const expectedToken = "mocked_token_for_user_" + testUserStored.id;
  expect(token).toBe(expectedToken);
});

it("throws UnauthorizedError when credentials are invalid", async () => {
  const payload: LoginUserInputDTO = {
    email: testUserInput.email,
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
    password: testUserInput.password
  };
  await expect(loginUserWithInvalidInput.execute(payload)).rejects.toThrow("Validation failed: Invalid email format");
});