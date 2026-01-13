import type HttpRequest from "./dtos/HttpRequest.ts";

import type LoginUser from "../usecases/login.ts";
import type RegisterUser from "../usecases/register.ts";
import type FetchUserProfile from "../usecases/profile.ts";
import type LogoutUser from "../usecases/logout.ts";
import type AuthenticateUser from "../usecases/authenticate.ts";
import type DeleteUser from "../usecases/delete.ts";
import type RegisterUserInputDTO from "../usecases/dtos/register-user-input.ts";
import type LoginUserInputDTO from "../usecases/dtos/login-user-input.ts";
import type AuthPresenter from "./presenter/AuthPresenter.ts";

export default class AuthController {
  constructor(
        private registerUser: RegisterUser,
        private loginUser: LoginUser,
        private fetchUserProfile: FetchUserProfile,
        private logoutUser: LogoutUser,
        private authenticateUser: AuthenticateUser,
        private deleteUser: DeleteUser,
        private authPresenter: AuthPresenter
  ) {}

  async register(req: HttpRequest) {
    const { email, name, password } = req.body as RegisterUserInputDTO;
    const user = await this.registerUser.execute({ email, name, password });
    return this.authPresenter.presentRegister(user);
  }

  async login(req: HttpRequest) {
    const { email, password } = req.body as LoginUserInputDTO;
    const token = await this.loginUser.execute({ email, password });
    return this.authPresenter.presentLogin(token);
  }

  async profile(req: HttpRequest) {
    const token = req.token;
    const user = await this.fetchUserProfile.execute(token);
    return this.authPresenter.presentProfile(user);
  }

  async authenticate(req: HttpRequest) {
    const token = req.token;
    const userId = await this.authenticateUser.execute(token);
    return this.authPresenter.presentAuthenticate(userId);
  }

  async logout(req: HttpRequest) {
    const token = req.token;
    await this.logoutUser.execute(token);
    return this.authPresenter.presentLogout();
  }

  async delete(req: HttpRequest) {
    const token = req.token;
    await this.deleteUser.execute(token);
    await this.logoutUser.execute(token);
    return this.authPresenter.presentDelete();
  }
}