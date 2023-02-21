'use strict'

const { keys } = require('../utils/object')
const resolve = require('../utils/resolve')
const SchemaValidator = require('../validators/schema')

const validateShape = async params => {
  const shape = resolve.shape(params.validator, params.payload)

  const errors = []

  for (const key of keys(shape)) {
    const shapeParams = {
      ...params,
      validator: shape[key],
      path: resolve.path(params.path, key, params.validator),
      key: resolve.key(key, params.validator),
    }

    errors.push(...await validate(shapeParams))
  }

  return errors
}

const isSchema = validator => validator instanceof SchemaValidator

const shouldValidateSchema = (validator, value) => {
  return isSchema(validator) && (!validator.checks.areOptional() || value)
}

const validate = async params => {
  const value = await resolve.value(params)
  const validator = await resolve.validator(params, value)
  const errors = await validator.checks.execute({ ...params, validator, value })

  if (shouldValidateSchema(validator, value)) {
    const shapeErrors = await validateShape({ ...params, validator, payload: value })

    errors.push(...shapeErrors)
  }

  return errors
}

module.exports = (validator, payload, customOptions = {}) => validate({
  ...customOptions,
  validator,
  payload,
})