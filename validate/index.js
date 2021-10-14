'use strict'

const runChecks = require('./run-checks')
const enrichSchemaWithItemValidator = require('./enrich-schema-with-item-validator')
const enrichSchemaWithForbiddenValidator = require('./enrich-schema-with-forbidden-validator')
const resolveValidator = require('./resolve-validator')
const SchemaValidator = require('../validators/schema')
const ArrayValidator = require('../validators/array')
const { BulkValidationError } = require('../errors')
const { compact } = require('../utils/array')
const { isNil } = require('../utils/predicates')

const composeItemPath = (path, attribute, isArray) => {
  const key = isArray ? `[${attribute}]` : attribute
  const separator = isArray ? '' : '.'

  return compact([path, key]).join(separator)
}

const enrichSchemaWithValidatorsIfNeeded = (validator, payload, options) => {
  if (options.strict) enrichSchemaWithForbiddenValidator(validator._shape, payload)
  if (validator._of) enrichSchemaWithItemValidator(validator._shape, validator._of, payload)
}

const validateSchema = async (validator, payload, options) => {
  const errors = []
  const isArrayValidator = validator instanceof ArrayValidator

  enrichSchemaWithValidatorsIfNeeded(validator, payload, options)

  for (const key of Object.keys(validator._shape)) {
    const itemValidator = validator._shape[key]

    const schemaErrors = await validate(key, payload, itemValidator, {
      ...options,
      path: composeItemPath(options.path, key, isArrayValidator),
    })

    errors.push(...schemaErrors)
  }

  return errors
}

const shouldValidateShape = (validator, value) => {
  const shouldValidate = () => validator.getChecks().some(c => c.force)

  return validator instanceof SchemaValidator && (shouldValidate() || value)
}

const validate = async (key, payload, validator, options) => {
  const value = isNil(key) ? payload : (payload && payload[key])

  const resolvedValidator = resolveValidator(validator, value, payload)

  const errors = await runChecks(resolvedValidator.getChecks(), value, options)

  if (shouldValidateShape(resolvedValidator, value)) {
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