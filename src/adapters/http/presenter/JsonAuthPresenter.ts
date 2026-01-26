import type User from "../../../entities/user.ts";
import type HTTPResponse from "../dtos/HttpResponse.ts";
import type AuthPresenter from "./AuthPresenter.ts";

export default class JsonAuthPresenter implements AuthPresenter {
  presentRegister(user: User): HTTPResponse<{ user: User }> {
    return {
      statusCode: 201,
      body: { user },
    };
  }

  presentLogin(token: string): HTTPResponse {
    return {
      statusCode: 200,
      token,
      body: { token }
    };
  }

  presentProfile(user: User): HTTPResponse<{ user: User }> {
    return {
      statusCode: 200,
      body: { user },
    };
  }

  presentAuthenticate(userId: number): HTTPResponse<{ userId: number }> {
    return {
      statusCode: 200,
      body: { userId },
    };
  }

  presentLogout(): HTTPResponse {
    return {
      statusCode: 204,
    };
  }

  presentDelete(): HTTPResponse {
    return {
      statusCode: 204,
    };
  }
}