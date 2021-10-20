'use strict'

const runChecks = require('./run-checks')
const resolveValidator = require('./resolve-validator')
const resolveShape = require('./resolve-shape')
const composePath = require('./compose-path')
const SchemaValidator = require('../validators/schema')
const { BulkValidationError } = require('../errors')
const { isNil } = require('../utils/predicates')

const validateSchema = async (validator, payload, options) => {
  const errors = []

  const shape = resolveShape(validator, payload, options)

  for (const key of Object.keys(shape)) {
    const schemaErrors = await validate(key, payload, shape[key], {
      ...options,
      path: composePath(options.path, key, validator),
    })

    errors.push(...schemaErrors)
  }

  return errors
}

const shouldValidateSchema = (validator, value) => {
  const shouldValidate = () => validator.getChecks().some(c => c.force)

  return validator instanceof SchemaValidator && (shouldValidate() || value)
}

const validate = async (key, payload, validator, options) => {
  const value = isNil(key) ? payload : (payload && payload[key])

  const resolvedValidator = resolveValidator(validator, value, payload)

  const errors = await runChecks(resolvedValidator.getChecks(), value, options)

  if (shouldValidateSchema(resolvedValidator, value)) {
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