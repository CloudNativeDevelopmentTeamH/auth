import { pinoHttp } from 'pino-http';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import AppError from '../../usecases/errors/app.ts';
import { randomUUID } from 'crypto';

const logger = pinoHttp({
  genReqId(req, res) {
    const existing = req.headers["x-request-id"];
    if (existing) return existing;
    const id = randomUUID();
    res.setHeader("X-Request-Id", id);
    return id;
  },

  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});

const notFound: RequestHandler = (_req, res) => {
  res.status(404).type("html").send("<div>404 Not Found</div>");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  req.log.error(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};

export default {
  logger,
  notFound,
  errorHandler,
}