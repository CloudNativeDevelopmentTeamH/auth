import { beforeEach, expect, it } from "vitest";
import LogoutUser from "../../src/usecases/logout.ts";
import { MockTokenService } from "../mocks/mocks.ts";
import UnauthorizedError from "../../src/usecases/errors/unauthorized.ts";

let tokenService: MockTokenService;
let logoutUser: LogoutUser;

beforeEach(() => {
  tokenService = new MockTokenService();
  logoutUser = new LogoutUser(tokenService);
});

it("throws UnauthorizedError when no token is provided", async () => {
  await expect(logoutUser.execute()).rejects.toThrow(UnauthorizedError);
});
