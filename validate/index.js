'use strict'

const runChecks = require('./run-checks')
const makeStrictSchema = require('./make-strict-schema')
const resolveValidator = require('./resolve-validator')
const SchemaValidator = require('../validators/schema')
const ArrayValidator = require('../validators/array')
const { BulkValidationError } = require('../errors')
const { toArray } = require('../utils/array')

const shouldValidateShape = (validator, value) => {
  const shouldValidate = () => validator.getChecks().some(c => c.force)

  return validator instanceof SchemaValidator && (shouldValidate() || value)
}

const validateObject = async (validator, payload, options) => {
  const errors = []
  const schemaPath = options.path ? options.path + '.' : options.path

  if (options.strict) {
    makeStrictSchema(validator, payload)
  }

  for (const key of Object.keys(validator)) {
    const schemaErrors = await validate(key, validator, payload, {
      ...options,
      path: `${schemaPath}${key}`,
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
    const schemaErrors = await validate(null, validator, data[i], {
      ...options,
      path: `${options.path}[${i}]`,
    })

    errors.push(...schemaErrors)
  }

  return errors
}

const validate = async (key, validator, payload, options) => {
  const value = key ? payload?.[key] : payload
  const currentValidator = key ? validator[key] : validator

  const resolvedValidator = resolveValidator(currentValidator, value, payload)

  const errors = await runChecks(resolvedValidator.getChecks(), value, options)

  if (shouldValidateShape(resolvedValidator, value)) {
    const schemaValidator = resolvedValidator instanceof ArrayValidator ? validateArray : validateObject

    const shapeErrors = await schemaValidator(resolvedValidator.getShapeValidator(), value, options)

    return errors.concat(shapeErrors)
  }

  return errors
}

/**
 * @param {GenericValidator|function(payload):GenericValidator} schema
 * @param {*} payload
 * @param {Boolean} [bulk]
 * @returns {Promise<void>}
 */
module.exports = async (schema, payload, bulk = false) => {
  const errors = await validate(null, schema, payload, { path: '', bulk })

  if (errors.length) {
    throw new BulkValidationError(errors)
  }
}