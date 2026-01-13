import { beforeEach, expect, it } from "vitest";
import AuthenticateUser from "../../src/usecases/authenticate.ts";
import { MockPasswordCrypto, MockTokenService, MockUserRepository } from "../mocks/mocks.ts";
import UnauthorizedError from "../../src/usecases/errors/unauthorized.ts";

let userRepository: MockUserRepository;
let tokenService: MockTokenService;
let authenticateUser: AuthenticateUser;
let crypto: MockPasswordCrypto;

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password1234"
}

beforeEach(async () => {
  userRepository = new MockUserRepository();
  tokenService = new MockTokenService();
  authenticateUser = new AuthenticateUser(tokenService);
  crypto = new MockPasswordCrypto();

  await userRepository.save({
    name: testUser.name,
    email: testUser.email,
    password: await crypto.hash(testUser.password)
  });
});

it("returns user id when valid token is provided", async () => {
  const user = await userRepository.findByEmail(testUser.email);
  const token = tokenService.issueToken(user!);
  const userId = await authenticateUser.execute(token);
  expect(userId).toBe(1);
});

it("throws UnauthorizedError when no token is provided", async () => {
  await expect(authenticateUser.execute()).rejects.toThrow(UnauthorizedError);
});

it("throws UnauthorizedError when invalid token is provided", async () => {
  await expect(authenticateUser.execute("invalid_token")).rejects.toThrow(UnauthorizedError);
});