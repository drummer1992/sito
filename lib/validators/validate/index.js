'use strict'

const resolveValidator = require('./resolve-validator')
const resolveShape = require('./resolve-shape')
const composePath = require('./compose-path')
const SchemaValidator = require('../schema')
const { BulkValidationError } = require('../../errors')
const { isNil } = require('../../utils/predicates')

const validateSchema = async (validator, payload, params) => {
  const errors = []

  const shape = resolveShape(validator, payload, params)

  for (const key of Object.keys(shape)) {
    const schemaErrors = await validate({
      payload,
      key,
      validator: shape[key],
      path: composePath(params.path, key, validator),
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
  const { key, payload, validator, path, bulk } = params

  const value = isNil(key) ? payload : (payload && payload[key])

  const resolvedValidator = resolveValidator(validator, value, key, payload)

  const errors = await resolvedValidator.checks.execute({
    value, key, path, bulk,
  })

  if (shouldValidateSchema(resolvedValidator, value)) {
    const shapeErrors = await validateSchema(resolvedValidator, value, params)

    return errors.concat(shapeErrors)
  }

  return errors
}

/**
 * @param {GenericValidator|function(payload):GenericValidator} validator
 * @param {*} payload
 * @param {Object} [options]
 * @param {Boolean} [options.bulk]
 * @returns {Promise<void>}
 */
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