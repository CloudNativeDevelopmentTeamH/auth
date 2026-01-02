import AuthController from "../../adapters/AuthController";
import JsonAuthPresenter from "../../adapters/presenter/JsonAuthPresenter";
import AuthenticateUser from "../../usecases/authenticate";
import DeleteUser from "../../usecases/delete";
import LoginUser from "../../usecases/login";
import LogoutUser from "../../usecases/logout";
import FetchUserProfile from "../../usecases/profile";
import RegisterUser from "../../usecases/register";
import ArgonPasswordCrypto from "../auth/argon-password-crypto";
import JwtTokenService from "../auth/jwt-token-service";
import PostgresUserRepository from "../persistence/postgres-user-repository";
import RegisterUserValidator from "../validation/register-validator";
import LoginUserValidator from "../validation/login-validator";

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