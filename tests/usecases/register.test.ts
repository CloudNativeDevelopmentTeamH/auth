import { beforeEach, expect, it } from "vitest";
import RegisterUser from "../../src/usecases/register.ts";
import { MockUserRepository, MockValidator, MockPasswordCrypto } from "../mocks/mocks.ts";
import type RegisterUserInputDTO from "../../src/usecases/dtos/register-user-input.ts";
import type Validator from "../../src/usecases/ports/outbound/validator.ts";
import type { ValidatorResult } from "../../src/usecases/ports/outbound/validator.ts";
import ValidationError from "../../src/usecases/errors/validation.ts";
import ConflictError from "../../src/usecases/errors/conflict.ts";

let userRepository: MockUserRepository;
let validator: MockValidator<RegisterUserInputDTO>;
let crypto: MockPasswordCrypto;
let registerUser: RegisterUser;

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password1234"
}

beforeEach(async () => {
  userRepository = new MockUserRepository();
  validator = new MockValidator<RegisterUserInputDTO>();
  crypto = new MockPasswordCrypto();
  registerUser = new RegisterUser(userRepository, validator, crypto);

  await userRepository.save({
    name: testUser.name,
    email: testUser.email,
    password: await crypto.hash(testUser.password)
  });
});

it("creates a new user with valid input", async () => {
  const payload: RegisterUserInputDTO = {
    name: "New User",
    email: "newuser@example.com",
    password: "securepassword123"
  };

  const user = await registerUser.execute(payload);
  const savedUser = await userRepository.findByEmail(payload.email);

  expect(user).toBeDefined();
  expect(user.id).toBe(savedUser?.id);
  expect(user.name).toBe(payload.name);
  expect(user.email).toBe(payload.email);
});

it("hashes the password before saving", async () => {
  const payload: RegisterUserInputDTO = {
    name: "New User",
    email: "newuser@example.com",
    password: "securepassword123"
  };

  await registerUser.execute(payload);
  const savedUser = await userRepository.findByEmail(payload.email);

  expect(savedUser?.password).toBe("hashed_" + payload.password);
  expect(savedUser?.password).not.toBe(payload.password);
});

it("throws ValidationError when input is invalid", async () => {
  class MockValidatorWithErrors<T> implements Validator<T> {
    validate(data: T): ValidatorResult<T> {
      return {
        data,
        errors: ["Invalid email format", "Password too short"]
      };
    }
  }

  const validatorWithErrors = new MockValidatorWithErrors<RegisterUserInputDTO>();
  const registerUserWithInvalidInput = new RegisterUser(userRepository, validatorWithErrors, crypto);

  const payload: RegisterUserInputDTO = {
    name: "New User",
    email: "invalid",
    password: "123"
  };

  await expect(registerUserWithInvalidInput.execute(payload)).rejects.toThrow(ValidationError);
});

it("throws ConflictError when user already exists", async () => {
  const payload: RegisterUserInputDTO = {
    name: "Another User",
    email: testUser.email,
    password: "differentpassword"
  };

  await expect(registerUser.execute(payload)).rejects.toThrow(ConflictError);
});
