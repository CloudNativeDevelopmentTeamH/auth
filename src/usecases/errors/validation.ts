import AppError from "./app";

export default class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}