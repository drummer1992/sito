'use strict'

const validate = require('./validate')
const { BulkValidationError } = require('../errors')
const interceptor = require('../interceptor')

const handleError = (...args) => interceptor.run('onBulkError', ...args)

module.exports = async (validator, payload, customOptions = {}) => {
  const options = { ...customOptions, throwFirst: false }

  const errors = await validate(validator, payload, options)

  if (errors.length) {
    throw await handleError(
        new BulkValidationError(errors),
        { ...options, validator, payload },
    )
  }
}