'use strict'

const resolve = require('./resolve')
const SchemaValidator = require('../../schema')
const { BulkValidationError } = require('../../../errors')

const validateSchema = async (validator, payload, params) => {
  const errors = []

  const shape = resolve.shape(validator, payload, params)

  for (const key of Object.keys(shape)) {
    const schemaErrors = await validate({
      payload,
      validator: shape[key],
      path: resolve.path(params.path, key, validator),
      key: resolve.key(key, validator),
      bulk: params.bulk,
    })

    errors.push(...schemaErrors)
  }

  return errors
}

const shouldValidateSchema = (validator, value) => {
  return validator instanceof SchemaValidator && value
}

const validate = async params => {
  const { key, payload, path, bulk } = params

  const value = resolve.value(key, payload)
  const validator = resolve.validator(params.validator, value, key, payload)

  const errors = await validator.checks.execute(value, key, path, bulk)

  if (shouldValidateSchema(validator, value)) {
    const shapeErrors = await validateSchema(validator, value, params)

    errors.push(...shapeErrors)
  }

  return errors
}

module.exports = async (validator, payload, options = {}) => {
  const errors = await validate({
    key: null,
    payload,
    validator,
    bulk: options.bulk,
  })

  if (errors.length) {
    throw new BulkValidationError(errors)
  }
}