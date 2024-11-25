import pkg from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = pkg;
import { responseError } from "./response.helper.js";

export const handlerError = (err, req, res, next) => {
  console.log("Lỗi ở cuối cùng", err);

  if (err instanceof JsonWebTokenError) err.code = 401;
  // token hết hạn : 403
  if (err instanceof TokenExpiredError) err.code = 403;

  const resData = responseError(err.message, err.code);

  res.status(resData.code).json(resData);
};

export class BadRequestError extends Error {
  constructor(message = "BadRequestError") {
    super(message);
    this.code = 400;
  }
}
// BadRequestError("Mật khẩu không chính xác");

export class ForbiddenError extends Error {
  constructor(message = "ForbiddenError") {
    super(message);
    this.code = 403;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "UnauthorizedError") {
    super(message);
    this.code = 401;
  }
}
