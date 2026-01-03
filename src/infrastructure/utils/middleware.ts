import type { ErrorRequestHandler, RequestHandler } from 'express';
import AppError from '../../usecases/errors/app';

const notFound: RequestHandler = (_req, res) => {
  res.status(404).type("html").send("<div>404 Not Found</div>");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  console.log(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};

export default {
  notFound,
  errorHandler,
}