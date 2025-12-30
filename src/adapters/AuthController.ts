import type ControllerRequest from "./Request";

import LoginUser from "../usecases/login";
import type RegisterUser from "../usecases/register";
import type LogoutUser from "../usecases/logout";
import type AuthenticateUser from "../usecases/authenticate";
import type DeleteUser from "../usecases/delete";

export default class AuthController {
    constructor(
        private RegisterUser: RegisterUser,
        private LoginUser: LoginUser,
        private LogoutUser: LogoutUser,
        private AuthenticateUser: AuthenticateUser,
        private DeleteUser: DeleteUser
    ) {}

    async register(req: ControllerRequest) {
        const { email, name, password } = req.body as { email: string; name: string; password: string };
        const user = await this.RegisterUser.execute({ email, name, password });
        return { user };
    }

    async login(req: ControllerRequest) {
        const { email, password } = req.body as { email: string; password: string };
        const token = await this.LoginUser.execute({ email, password });
        return { token };
    }

    async logout(req: ControllerRequest) {
        const token = req.token;
        await this.LogoutUser.execute(token);
    }

    async authenticate(req: ControllerRequest) {
        const token = req.token;
        const user = await this.AuthenticateUser.execute(token ? token : "");
        return { user };
    }

    async delete(req: ControllerRequest) {
        const token = req.token;
        await this.DeleteUser.execute(token);
    }
}