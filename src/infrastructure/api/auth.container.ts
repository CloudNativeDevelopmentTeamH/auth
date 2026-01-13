import AuthController from "../../adapters/AuthController.ts";
import JsonAuthPresenter from "../../adapters/presenter/JsonAuthPresenter.ts";
import AuthenticateUser from "../../usecases/authenticate.ts";
import DeleteUser from "../../usecases/delete.ts";
import LoginUser from "../../usecases/login.ts";
import LogoutUser from "../../usecases/logout.ts";
import FetchUserProfile from "../../usecases/profile.ts";
import RegisterUser from "../../usecases/register.ts";
import ArgonPasswordCrypto from "../auth/argon-password-crypto.ts";
import JwtTokenService from "../auth/jwt-token-service.ts";
import PostgresUserRepository from "../persistence/postgres-user-repository.ts";
import RegisterUserValidator from "../validation/register-validator.ts";
import LoginUserValidator from "../validation/login-validator.ts";

const userRepository = new PostgresUserRepository();
const tokenService = new JwtTokenService();
const crypto = new ArgonPasswordCrypto();

const validators = {
  register: RegisterUserValidator,
  login: LoginUserValidator,
}

const usecases = {
  registerUser: new RegisterUser(userRepository, validators.register, crypto),
  loginUser: new LoginUser(userRepository, validators.login, crypto, tokenService),
  fetchUserProfile: new FetchUserProfile(tokenService, userRepository),
  logoutUser: new LogoutUser(tokenService),
  authenticateUser: new AuthenticateUser(tokenService),
  deleteUser: new DeleteUser(userRepository, tokenService),
}

const controller = new AuthController(
  usecases.registerUser,
  usecases.loginUser,
  usecases.fetchUserProfile,
  usecases.logoutUser,
  usecases.authenticateUser,
  usecases.deleteUser,
  new JsonAuthPresenter()
);

export default controller;