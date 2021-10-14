'use strict'

const runChecks = require('./run-checks')
const makeStrictSchema = require('./make-strict-schema')
const resolveValidator = require('./resolve-validator')
const SchemaValidator = require('../validators/schema')
const ArrayValidator = require('../validators/array')
const { BulkValidationError } = require('../errors')
const { toArray, compact } = require('../utils/array')
const { isNil } = require('../utils/predicates')

const shouldValidateShape = (validator, value) => {
  const shouldValidate = () => validator.getChecks().some(c => c.force)

  return validator instanceof SchemaValidator && (shouldValidate() || value)
}

const validateObject = async (validator, payload, options) => {
  const errors = []

  if (options.strict) {
    makeStrictSchema(validator._shape, payload)
  }

  for (const key of Object.keys(validator._shape)) {
    const schemaErrors = await validate(key, payload, validator._shape[key], {
      ...options,
      path: compact([options.path, key]).join('.'),
    })

    errors.push(...schemaErrors)
  }

  return errors
}

const validateArray = async (validator, payload, options) => {
  const errors = []
  const data = toArray(payload)
  const iterations = Math.max(data.length, 1)

  for (let i = 0; i < iterations; i++) {
    const schemaErrors = await validate(i, data, validator._of, {
      ...options,
      path: compact([options.path, `[${i}]`]).join(''),
    })

    errors.push(...schemaErrors)
  }

  return errors
}

const validate = async (key, payload, validator, options) => {
  const value = isNil(key) ? payload : payload?.[key]

  const resolvedValidator = resolveValidator(validator, value, payload)

  const errors = await runChecks(resolvedValidator.getChecks(), value, options)

  if (shouldValidateShape(resolvedValidator, value)) {
    const validateSchema = resolvedValidator instanceof ArrayValidator ? validateArray : validateObject

    const shapeErrors = await validateSchema(resolvedValidator, value, options)

    return errors.concat(shapeErrors)
  }

  return errors
}

/**
 * @typedef {Object} ValidationOptions
 * @property {Boolean} [bulk]
 * @property {Boolean} [strict]
 */

/**
 * @param {GenericValidator|function(payload):GenericValidator} schema
 * @param {*} payload
 * @param {ValidationOptions} [options]
 * @returns {Promise<void>}
 */
module.exports = async (schema, payload, options = {}) => {
  const errors = await validate(null, payload, schema, {
    bulk: options.bulk,
    strict: options.strict,
  })

  if (errors.length) {
    throw new BulkValidationError(errors)
  }
}