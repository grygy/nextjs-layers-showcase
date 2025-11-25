export class DomainError extends Error {
  readonly code: string;

  constructor(
    message: string,
    code: string,
  ) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class UserNotFoundError extends DomainError {
  readonly userId: string;

  constructor(userId: string) {
    super(`User with id ${userId} not found`, 'USER_NOT_FOUND');
    this.userId = userId;
  }
}

