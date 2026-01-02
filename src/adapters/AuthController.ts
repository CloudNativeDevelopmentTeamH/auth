import type HttpRequest from "./dtos/HttpRequest";

import type LoginUser from "../usecases/login";
import type RegisterUser from "../usecases/register";
import type FetchUserProfile from "../usecases/profile";
import type LogoutUser from "../usecases/logout";
import type AuthenticateUser from "../usecases/authenticate";
import type DeleteUser from "../usecases/delete";
import type RegisterUserInputDTO from "../usecases/dtos/register-user-input";
import type LoginUserInputDTO from "../usecases/dtos/login-user-input";
import type AuthPresenter from "./presenter/JsonAuthPresenter";

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
        try {
            const user = await this.registerUser.execute({ email, name, password });
            return this.authPresenter.presentRegister(user);
        }
        catch (error) {
            return this.authPresenter.presentError(error);
        }
    }

    async login(req: HttpRequest) {
        const { email, password } = req.body as LoginUserInputDTO;
        try {
            const token = await this.loginUser.execute({ email, password });
            return this.authPresenter.presentLogin(token);
        }
        catch (error) {
            return this.authPresenter.presentError(error);
        }
    }

    async profile(req: HttpRequest) {
        const token = req.token;
        try {
            const user = await this.fetchUserProfile.execute(token);
            return this.authPresenter.presentProfile(user);
        }
        catch (error) {
            return this.authPresenter.presentError(error);
        }
    }

    async authenticate(req: HttpRequest) {
        const token = req.token;
        try {
            const userId = await this.authenticateUser.execute(token);
            return this.authPresenter.presentAuthenticate(userId);
        }
        catch (error) {
            return this.authPresenter.presentError(error);
        }
    }

    async logout(req: HttpRequest) {
        const token = req.token;
        try {
            await this.logoutUser.execute(token);
            return this.authPresenter.presentLogout();
        }
        catch (error) {
            return this.authPresenter.presentError(error);
        }
    }

    async delete(req: HttpRequest) {
        const token = req.token;
        try {
            await this.deleteUser.execute(token);
            return this.authPresenter.presentDelete();
        }
        catch (error) {
            return this.authPresenter.presentError(error);
        }
    }
}