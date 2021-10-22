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

const runOneCheck = async (check, value, path) => {
  const validate = check.force ? check.validate : makeOptional(check.validate)

  if (!await validate(value)) {
    const message = await getMessage(check.message, value, path)

    return new ValidationError(message, value, path)
  }
}

module.exports = async (checks, value, options) => {
  const errors = []

  for (const check of checks) {
    const error = await runOneCheck(check, value, options.path)

    if (error) {
      if (!options.bulk) {
        throw error
      }

      errors.push(error)
    }
  }

  return errors
}