'use strict'

const { keys } = require('../utils/object')
const resolve = require('../utils/resolve')
const SchemaValidator = require('../validators/schema')

const validateShape = async params => {
  const value = resolve.value(params.key, params.payload)
  const shape = resolve.shape(params.validator, value)

  const errors = []

  for (const key of keys(shape)) {
    const shapeParams = {
      ...params,
      payload: value,
      validator: shape[key],
      path: resolve.path(params.path, key, params.validator),
      key: resolve.key(key, params.validator),
    }

    errors.push(...await validate(shapeParams))
  }

  return errors
}

const isOptional = validator => validator.checks.isOptional()
const isSchema = validator => validator instanceof SchemaValidator

const shouldValidateSchema = (validator, value) => {
  return isSchema(validator) && (!isOptional(validator) || value)
}

const validate = async params => {
  const value = resolve.value(params.key, params.payload)
  const validator = resolve.validator(params, value)

  const errors = await validator.checks.execute({ ...params, value })

  if (shouldValidateSchema(validator, value)) {
    const shapeErrors = await validateShape({ ...params, validator })

    errors.push(...shapeErrors)
  }

  return errors
}

module.exports = (validator, payload, customOptions = {}) => validate({
  ...customOptions,
  validator,
  payload,
})