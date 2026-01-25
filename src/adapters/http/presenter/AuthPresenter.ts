import type User from "../../../entities/user.ts";
import type HTTPResponse from "../dtos/HttpResponse.ts";

export default interface AuthPresenter {
  presentRegister(user: User): HTTPResponse<{ user: User }>;
  presentLogin(token: string): HTTPResponse;
  presentProfile(user: User): HTTPResponse<{ user: User }>;
  presentAuthenticate(userId: number): HTTPResponse<{ userId: number }>;
  presentLogout(): HTTPResponse;
  presentDelete(): HTTPResponse;
}