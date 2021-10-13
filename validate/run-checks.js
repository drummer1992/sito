'use strict'

const { isNil } = require('../utils/predicates')
const { ValidationError } = require('../errors')

const DEFAULT_ROOT_ATTRIBUTE = 'payload'

const getMessage = (message, value, path) => typeof message === 'function'
    ? message(path || DEFAULT_ROOT_ATTRIBUTE, value)
    : message

const makeOptional = validate => {
  return value => {
    if (isNil(value)) {
      return true
    }

    return validate(value)
  }
}

module.exports = async (checks, value, options) => {
  const errors = []

  const runOneCheck = async check => {
    const validate = check.force ? check.validate : makeOptional(check.validate)

    if (!await validate(value)) {
      const message = await getMessage(check.message, value, options.path)

      const error = new ValidationError(message, options.path)

      if (options.bulk) {
        return error
      }

      throw error
    }
  }

  for (const check of checks) {
    const error = await runOneCheck(check)

    if (error) {
      errors.push(error)
    }
  }

  return errors
}