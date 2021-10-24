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

const resolveValue = (key, payload) => isNil(key) ? payload : (payload && payload[key])

const validate = async params => {
  const { key, payload, path, bulk } = params

  const value = resolveValue(key, payload)
  const validator = resolveValidator(params.validator, value, key, payload)

  const errors = await validator.checks.execute(value, key, path, bulk)

  if (shouldValidateSchema(validator, value)) {
    const shapeErrors = await validateSchema(validator, value, params)

    errors.push(...shapeErrors)
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