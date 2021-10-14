'use strict'

class ValidationError extends Error {
  constructor(message, target) {
    super(message)

    this.target = target
  }

  toJSON() {
    return {
      message: this.message,
      target: this.target,
    }
  }
}

class BulkValidationError extends ValidationError {
  constructor(errors) {
    super('Bulk Validation Failed')

    this.errors = errors
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    }
  }
}

module.exports = { ValidationError, BulkValidationError }