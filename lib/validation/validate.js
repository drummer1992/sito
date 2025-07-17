'use strict'

const { keys } = require('../utils/object')
const resolve = require('../utils/resolve')
const SchemaValidator = require('../validators/schema')
const { isNil, isUndefined } = require('../utils/predicates')

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

const mapValue = async (value, mapper, params, isRoot) => {
  const { fn, optional } = mapper

  const map = optional
    ? (x, ...rest) => !x ? x : fn(x, ...rest)
    : fn

  value = await map(value, params.key, params.payload, params.root)

  if (!isUndefined(value) || (params.payload && params.key in params.payload)) {
    isRoot && (params.payload = value)
    !isRoot && (params.payload[params.key] = value)
  }

  return value
}

const runMappers = (value, mappers, params, isRoot) => mappers.reduce(async (res, mapper) => {
  return mapValue(await res, mapper, params, isRoot)
}, Promise.resolve(value))

const validate = async params => {
  const isRoot = isNil(params.key)

  let value = isRoot
    ? params.payload
    : (params.payload && params.payload[params.key])

  const validator = await resolve.validator(params, value)

  value = await runMappers(value, validator.mappers.beforeValidation, params, isRoot)

  const errors = []

  await validator.checks.execute({ ...params, validator, value })
    .catch(error => {
      if (params.throwFirst) {
        throw error
      }

      errors.push(error)
    })

  value = await runMappers(value, validator.mappers.afterValidation, params, isRoot)

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
  root: payload,
})