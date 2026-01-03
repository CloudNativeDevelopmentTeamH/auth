import { it, expect } from "vitest";
import { testUserInput, testUserStored, MockUserRepository, MockValidator, MockPasswordCrypto, MockTokenService } from "../mocks/mocks";
import type LoginUserInputDTO from "../../src/usecases/dtos/login-user-input";
import LoginUser from "../../src/usecases/login";

it("returns token when credentials are valid", async () => {
  const userRepository = new MockUserRepository();
  const validator = new MockValidator<LoginUserInputDTO>();
  const crypto = new MockPasswordCrypto();
  const tokenService = new MockTokenService();
  const loginUser = new LoginUser(userRepository, validator, crypto, tokenService);

  const payload: LoginUserInputDTO = {
    email: testUserInput.email,
    password: testUserInput.password
  };

  const token = await loginUser.execute(payload);
  const expectedToken = "mocked_token_for_user_" + testUserStored.id;
  expect(token).toBe(expectedToken);
});