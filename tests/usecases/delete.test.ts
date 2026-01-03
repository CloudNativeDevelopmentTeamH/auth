import { beforeEach, it } from "vitest";
import DeleteUser from "../../src/usecases/delete";
import { MockTokenService, MockUserRepository } from "../mocks/mocks";

const userRepository = new MockUserRepository();
const tokenService = new MockTokenService();
let deleteUser: DeleteUser;

beforeEach(() => {
  deleteUser = new DeleteUser(userRepository, tokenService);
});


it("delets the user if valid token is provided", async () => {

});