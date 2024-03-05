export class NeonError extends Error {

  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeonError);
    }
  }

}

export class NeonHmacSignatureValidationError extends NeonError {

  constructor(message: string) {
    super(message);
    this.name = "hmacSignatureValidationError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeonError);
    }
  }

}

export class NeonParseError extends NeonError {

  constructor(message: string) {
    super(message);
    this.name = "parseError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeonError);
    }
  }

}

export class NeonHandlerImplementationError extends NeonError {

  constructor(message: string) {
    super(message);
    this.name = "handlerImplementationError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeonError);
    }
  }

}
