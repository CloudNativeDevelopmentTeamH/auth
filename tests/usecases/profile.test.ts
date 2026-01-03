import { beforeEach, expect, it } from "vitest";
import FetchUserProfile from "../../src/usecases/profile";
import { MockUserRepository, MockTokenService, MockPasswordCrypto } from "../mocks/mocks";
import UnauthorizedError from "../../src/usecases/errors/unauthorized";

let userRepository: MockUserRepository;
let tokenService: MockTokenService;
let crypto: MockPasswordCrypto;
let fetchUserProfile: FetchUserProfile;

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password1234"
};

beforeEach(async () => {
  userRepository = new MockUserRepository();
  tokenService = new MockTokenService();
  crypto = new MockPasswordCrypto();
  fetchUserProfile = new FetchUserProfile(tokenService, userRepository);

  await userRepository.save({
    name: testUser.name,
    email: testUser.email,
    password: await crypto.hash(testUser.password)
  });
});

it("returns user profile when valid token is provided", async () => {
  const savedUser = await userRepository.findByEmail(testUser.email);
  const token = tokenService.issueToken(savedUser!);

  const user = await fetchUserProfile.execute(token);

  expect(user).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.email).toBe(testUser.email);
  expect(user.name).toBe(testUser.name);
});

it("throws UnauthorizedError when no token is provided", async () => {
  await expect(fetchUserProfile.execute()).rejects.toThrow(UnauthorizedError);
});

it("throws UnauthorizedError when invalid token is provided", async () => {
  await expect(fetchUserProfile.execute("invalid_token")).rejects.toThrow(UnauthorizedError);
});

it("throws Error when user does not exist", async () => {
  const fakeUser = {
    id: 999,
    name: "Fake User",
    email: "fake@example.com",
    password: "fakepassword"
  };
  
  const token = tokenService.issueToken(fakeUser);

  await expect(fetchUserProfile.execute(token)).rejects.toThrow("User not found");
});
