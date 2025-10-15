/**
 * Base error class for all Novitus SDK errors
 */
export class NovitusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NovitusError';
    Object.setPrototypeOf(this, NovitusError.prototype);
  }
}

/**
 * Error thrown when API request fails
 */
export class NovitusApiError extends NovitusError {
  public readonly statusCode?: number;
  public readonly errorCode?: number;
  public readonly errorDescription?: string;

  constructor(
    message: string,
    statusCode?: number,
    errorCode?: number,
    errorDescription?: string
  ) {
    super(message);
    this.name = 'NovitusApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorDescription = errorDescription;
    Object.setPrototypeOf(this, NovitusApiError.prototype);
  }
}

/**
 * Error thrown when validation fails
 */
export class NovitusValidationError extends NovitusError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'NovitusValidationError';
    this.field = field;
    Object.setPrototypeOf(this, NovitusValidationError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class NovitusAuthError extends NovitusError {
  constructor(message: string) {
    super(message);
    this.name = 'NovitusAuthError';
    Object.setPrototypeOf(this, NovitusAuthError.prototype);
  }
}

/**
 * Error thrown when network request fails
 */
export class NovitusNetworkError extends NovitusError {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'NovitusNetworkError';
    Object.setPrototypeOf(this, NovitusNetworkError.prototype);
  }
}


