'use strict'

class ValidationError extends Error {
  constructor(message, value, path) {
    super(message)

    this.path = path
    this.value = value
    this.name = ValidationError.name
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      path: this.path,
      value: this.value,
    }
  }
}

class BulkValidationError extends ValidationError {
  constructor(errors) {
    super('Bulk Validation Failed')

    this.errors = errors
    this.name = BulkValidationError.name
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    }
  }
}

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

module.exports = {
  ValidationError,
  BulkValidationError,
  assert,
}