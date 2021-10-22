'use strict'

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
  return validator instanceof SchemaValidator && value
}

const validate = async (key, payload, validator, options) => {
  const value = isNil(key) ? payload : (payload && payload[key])

  const resolvedValidator = resolveValidator(validator, value, payload)

  const errors = await resolvedValidator.checks.run(value, options)

  if (shouldValidateSchema(resolvedValidator, value)) {
    const shapeErrors = await validateSchema(resolvedValidator, value, options)

    return errors.concat(shapeErrors)
  }

  return errors
}

/**
 * @param {GenericValidator|function(payload):GenericValidator} schema
 * @param {*} payload
 * @param {Object} [options]
 * @param {Boolean} [options.bulk]
 * @returns {Promise<void>}
 */
module.exports = async (schema, payload, options = {}) => {
  const errors = await validate(null, payload, schema, {
    bulk: options.bulk,
  })

  if (errors.length) {
    throw new BulkValidationError(errors)
  }
}