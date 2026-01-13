import AppError from "./app.ts";

export default class UnauthorizedError extends AppError {
  readonly code = "UNAUTHORIZED";
  readonly status = 401;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}