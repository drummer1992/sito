'use strict'

class ValidationError extends Error {
  constructor(message, path, value, key) {
    super()

    this.path = path
    this.value = value
    this.key = key
    this.name = ValidationError.name
    this.message = message
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      path: this.path,
      key: this.key,
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