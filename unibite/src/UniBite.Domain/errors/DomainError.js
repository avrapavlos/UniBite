// Base error class for predictable, business-rule violations.
// The API layer's error middleware knows how to translate this into an HTTP response.

class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'DomainError';
    this.statusCode = statusCode;
  }
}

class NotFoundError extends DomainError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = { DomainError, NotFoundError };
