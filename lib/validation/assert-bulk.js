'use strict'

const validate = require('./validate')
const { BulkValidationError } = require('../errors')

module.exports = async (validator, payload, customOptions = {}) => {
  const errors = await validate(validator, payload, { ...customOptions, throwFirst: false })

  if (errors.length) {
    throw new BulkValidationError(errors)
  }
}