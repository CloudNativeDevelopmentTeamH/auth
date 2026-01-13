import AppError from "./app.ts";

export default class ConflictError extends AppError {
  readonly code = "CONFLICT_ERROR";
  readonly status = 409;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}