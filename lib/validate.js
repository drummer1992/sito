'use strict'

const { keys } = require('./utils/object')
const resolve = require('./utils/resolve')
const SchemaValidator = require('./validators/schema')

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
      bulk: params.bulk,
    }

    errors.push(...await validate(shapeParams))
  }

  return errors
}

const validate = async params => {
  const value = resolve.value(params.key, params.payload)
  const validator = resolve.validator(params, value)

  const errors = await validator.checks.execute({ ...params, value })

  if (validator instanceof SchemaValidator) {
    const shapeErrors = await validateShape({ ...params, validator })

    errors.push(...shapeErrors)
  }

  return errors
}

module.exports = validate