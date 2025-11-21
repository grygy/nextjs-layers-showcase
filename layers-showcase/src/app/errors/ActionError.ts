export class ActionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class FetchUsersError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to fetch users', 'FETCH_USERS_ERROR', cause);
  }
}

export class FetchUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to fetch user', 'FETCH_USER_ERROR', cause);
  }
}

export class CreateUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to create user', 'CREATE_USER_ERROR', cause);
  }
}

export class UpdateUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to update user', 'UPDATE_USER_ERROR', cause);
  }
}

export class DeleteUserError extends ActionError {
  constructor(cause?: unknown) {
    super('Failed to delete user', 'DELETE_USER_ERROR', cause);
  }
}

