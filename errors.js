'use strict'

class ValidationError extends Error {
  constructor(message, target) {
    super(message)

    this.target = target
  }
}

class BulkValidationError extends Error {
  constructor(errors) {
    super('Bulk Validation Failed')

    this.errors = errors
  }
}

module.exports = { ValidationError, BulkValidationError }