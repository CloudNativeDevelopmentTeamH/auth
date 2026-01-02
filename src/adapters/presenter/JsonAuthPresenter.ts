import type User from "../../entities/user";
import AppError from "../../usecases/errors/app";
import type ErrorDTO from "../dtos/Error";
import type HTTPResponse from "../dtos/HttpResponse";
import type AuthPresenter from "./AuthPresenter";

const COOKIE_NAME = "auth_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  path: "/",
  sameSite: "strict" as const
}

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
      cookie: {
        name: COOKIE_NAME,
        value: token,
        options: { ...COOKIE_OPTIONS },
      }
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
      cookie: {
        name: COOKIE_NAME,
        value: "",
        options: {
          ...COOKIE_OPTIONS,
          maxAge: 0, // Expire the cookie immediately
        }
      }
    };
  }

  presentDelete(): HTTPResponse {
    return {
      statusCode: 204,
    };
  }

  presentError(error: unknown): HTTPResponse<ErrorDTO> {
    console.log(error);
    if (error instanceof AppError) {
      return {
        statusCode: error.status,
        body: { 
          error: { 
            code: error.code,
            message: error.message } 
        }
      };
    }     
    return {
      statusCode: 500,
      body: { 
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred."
        }
      },
    }   
  }
}