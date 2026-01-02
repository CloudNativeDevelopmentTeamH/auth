import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

const notFound = (_req: Request, res: Response) => {
  res.status(404).type("html").send("<div>404 Not Found</div>");
}

const errorHandler = (err: ErrorRequestHandler, _req: Request, _res: Response, next: NextFunction) => {
  console.log(err);
  next(err);
};

export default {
  notFound,
  errorHandler,
}