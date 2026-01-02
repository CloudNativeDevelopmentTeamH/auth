import type User from "../entities/user";
import AppError from "../usecases/errors/app";
import type HTTPResponse from "./HttpResponse";

export default class AuthPresenter {
    presentRegister(user: User): HTTPResponse<{ user: User }> {
        return {
            statusCode: 201,
            body: { user },
        };
    }

    presentLogin(token: string): HTTPResponse<{ token: string }> {
        return {
            statusCode: 200,
            cookie: {
                name: "auth_token",
                value: token,
                options: {
                    httpOnly: true,
                    secure: true,
                    maxAge: 24 * 60 * 60, // 1 day
                    path: "/",
                    sameSite: "strict"
                }
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
                name: "auth_token",
                value: "",
                options: {
                    httpOnly: true,
                    secure: true,
                    maxAge: 0, // Expire the cookie immediately
                    path: "/",
                    sameSite: "strict"
                }
            }
        };
    }

    presentDelete(): HTTPResponse {
        return {
            statusCode: 204,
        };
    }

    presentError(error: unknown): HTTPResponse<{ error: string }> {
        if (error instanceof AppError) {
            return {
                statusCode: error.status,
                body: { error: error.code +  ": " + error.message },
            };
        }     
        return {
            statusCode: 500,
            body: { error: "INTERNAL_SERVER_ERROR: An unexpected error occurred." },
        }   
    }
}