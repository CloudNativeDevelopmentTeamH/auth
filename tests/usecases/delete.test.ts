import { beforeEach, expect, it } from "vitest";
import DeleteUser from "../../src/usecases/delete.ts";
import { MockPasswordCrypto, MockTokenService, MockUserRepository } from "../mocks/mocks.ts";

let userRepository: MockUserRepository;
let crypto: MockPasswordCrypto;
let tokenService: MockTokenService;
let deleteUser: DeleteUser;

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password1234"
}

beforeEach(async () => {
  userRepository = new MockUserRepository();
  tokenService = new MockTokenService();
  crypto = new MockPasswordCrypto();
  deleteUser = new DeleteUser(userRepository, tokenService);

  await userRepository.save({
    name: testUser.name,
    email: testUser.email,
    password: await crypto.hash(testUser.password)
  });
});


it("delets the user if valid token is provided", async () => {
  const user = await userRepository.findByEmail(testUser.email);
  const token = tokenService.issueToken(user!);
  
  await deleteUser.execute(token);
  
  const deletedUser = await userRepository.findByEmail(testUser.email);
  expect(deletedUser).toBe(null);
});

it("throws UnauthorizedError if no token is provided", async () => {
  await expect(deleteUser.execute()).rejects.toThrow("No token provided");
});

it("throws UnauthorizedError if invalid token is provided", async () => {
  await expect(deleteUser.execute("invalid_token")).rejects.toThrow("Invalid or expired token");
});