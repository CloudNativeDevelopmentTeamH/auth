import type ControllerRequest from "./Request";

import type LoginUser from "../usecases/login";
import type RegisterUser from "../usecases/register";
import type FetchUserProfile from "../usecases/profile";
import type LogoutUser from "../usecases/logout";
import type AuthenticateUser from "../usecases/authenticate";
import type DeleteUser from "../usecases/delete";
import type RegisterUserInputDTO from "../usecases/dtos/register-user-input";
import type LoginUserInputDTO from "../usecases/dtos/login-user-input";

export default class AuthController {
    constructor(
        private RegisterUser: RegisterUser,
        private LoginUser: LoginUser,
        private FetchUserProfile: FetchUserProfile,
        private LogoutUser: LogoutUser,
        private AuthenticateUser: AuthenticateUser,
        private DeleteUser: DeleteUser
    ) {}

    async register(req: ControllerRequest) {
        const { email, name, password } = req.body as RegisterUserInputDTO;
        const user = await this.RegisterUser.execute({ email, name, password });
        return { user };
    }

    async login(req: ControllerRequest) {
        const { email, password } = req.body as LoginUserInputDTO;
        const token = await this.LoginUser.execute({ email, password });
        return { token };
    }

    async profile(req: ControllerRequest) {
        const token = req.token;
        const user = await this.FetchUserProfile.execute(token);
        return { user };
    }

    async authenticate(req: ControllerRequest) {
        const token = req.token;
        const user = await this.AuthenticateUser.execute(token);
        return { user };
    }

    async logout(req: ControllerRequest) {
        const token = req.token;
        await this.LogoutUser.execute(token);
    }

    async delete(req: ControllerRequest) {
        const token = req.token;
        await this.DeleteUser.execute(token);
    }
}