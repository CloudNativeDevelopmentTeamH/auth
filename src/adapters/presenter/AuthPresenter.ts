import type User from "../../entities/user";
import type ErrorDTO from "../dtos/Error";
import type HTTPResponse from "../dtos/HttpResponse";

export default interface AuthPresenter {
    presentRegister(user: User): HTTPResponse<{ user: User }>;
    presentLogin(token: string): HTTPResponse;
    presentProfile(user: User): HTTPResponse<{ user: User }>;
    presentAuthenticate(userId: number): HTTPResponse<{ userId: number }>;
    presentLogout(): HTTPResponse;
    presentDelete(): HTTPResponse;
    presentError(error: unknown): HTTPResponse<ErrorDTO>;
}