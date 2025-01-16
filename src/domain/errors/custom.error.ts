export class CustomError extends Error {
  constructor(public readonly message: string, public readonly status: number) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype); // Corrige el prototipo para herencia adecuada
  }

  // 400 Bad Request
  static badRequest(message: string): CustomError {
    return new CustomError(message, 400);
  }

  // 401 Unauthorized
  static unauthorized(message: string): CustomError {
    return new CustomError(message, 401);
  }

  // 403 Forbidden
  static forbidden(message: string): CustomError {
    return new CustomError(message, 403);
  }

  // 404 Not Found
  static notFound(message: string): CustomError {
    return new CustomError(message, 404);
  }

  // 409 Conflict
  static conflict(message: string): CustomError {
    return new CustomError(message, 409);
  }

  // 422 Unprocessable Entity
  static unprocessableEntity(message: string): CustomError {
    return new CustomError(message, 422);
  }

  // 429 Too Many Requests
  static tooManyRequests(message: string): CustomError {
    return new CustomError(message, 429);
  }

  // 500 Internal Server Error
  static internalServerError(
    message: string = "Internal Server Error"
  ): CustomError {
    return new CustomError(message, 500);
  }

  // 502 Bad Gateway
  static badGateway(message: string): CustomError {
    return new CustomError(message, 502);
  }

  // 503 Service Unavailable
  static serviceUnavailable(message: string): CustomError {
    return new CustomError(message, 503);
  }
}
