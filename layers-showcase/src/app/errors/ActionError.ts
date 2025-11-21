/**
 * Base class for all server action errors
 */
export class ActionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown,
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
 * Thrown when fetching users fails
 */
export class FetchUsersError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to fetch users', 'FETCH_USERS_ERROR', cause);
  }
}

/**
 * Thrown when fetching a single user fails
 */
export class FetchUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to fetch user', 'FETCH_USER_ERROR', cause);
  }
}

/**
 * Thrown when creating a user fails
 */
export class CreateUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to create user', 'CREATE_USER_ERROR', cause);
  }
}

/**
 * Thrown when updating a user fails
 */
export class UpdateUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to update user', 'UPDATE_USER_ERROR', cause);
  }
}

/**
 * Thrown when deleting a user fails
 */
export class DeleteUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to delete user', 'DELETE_USER_ERROR', cause);
  }
}

