/**
 * Base class for all domain errors
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when a user is not found
 */
export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with id ${userId} not found`, 'USER_NOT_FOUND');
    this.userId = userId;
  }

  public readonly userId: string;
}

