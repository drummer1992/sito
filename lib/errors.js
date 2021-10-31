'use strict'

class GenericValidationError extends Error {
  constructor(message) {
    super()

    this.message = message
    this.name = this.constructor.name
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
    }
  }
}

class ValidationError extends GenericValidationError {
  constructor(message, path, value, key) {
    super(message)

    this.path = path
    this.value = value
    this.key = key
  }

  toJSON() {
    return {
      ...super.toJSON(),
      path: this.path,
      key: this.key,
      value: this.value,
    }
  }
}

class BulkValidationError extends GenericValidationError {
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

class InternalValidatorError extends Error {}

const assert = (condition, message) => {
  if (!condition) {
    throw new InternalValidatorError(message)
  }
}

module.exports = {
  GenericValidationError,
  ValidationError,
  BulkValidationError,
  InternalValidatorError,
  assert,
}