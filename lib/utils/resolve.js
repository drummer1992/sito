'use strict'

const sito = require('../index')
const { isNil } = require('./predicates')
const { compact } = require('./array')
const { keys } = require('./object')

const shouldBeForbidden = (key, schema, shape) => {
  return schema.isStrict() && !shape[key]
}

const hasItemValidator = schema => {
  return Boolean(schema.getItemValidator())
}

const shouldEnrichShape = schema => {
  return schema.isStrict() || hasItemValidator(schema)
}

const getEnrichedShape = (schema, payload) => {
  const shape = schema.getShape()

  for (const key of keys(payload)) {
    if (hasItemValidator(schema)) {
      shape[key] = schema.getItemValidator()
    }

    if (shouldBeForbidden(key, schema, shape)) {
      shape[key] = sito.forbidden()
    }
  }

  return shape
}

exports.shape = (schemaValidator, payload) => {
  if (shouldEnrichShape(schemaValidator)) {
    return getEnrichedShape(schemaValidator, payload)
  }

  return schemaValidator.getShape()
}

exports.validator = (maybeValidator, payload, key, object) => {
  const GenericValidator = require('../validators/generic')

  if (maybeValidator instanceof GenericValidator) {
    return maybeValidator
  } else if (typeof maybeValidator === 'function') {
    return maybeValidator(payload, key, object)
  }

  throw new Error(
      'Not valid validator provided. '
      + 'It should be instance of GenericValidator, '
      + 'or the function which returns instance of GenericValidator.',
  )
}

exports.constructor = (maybeValidator, payload, key, object) => {
  const validator = exports.validator(maybeValidator, payload, key, object)

  return validator.constructor
}

exports.path = (path, attribute, validator) => {
  const ArrayValidator = require('../validators/array')

  const isArray = validator instanceof ArrayValidator
  const key = isArray ? `[${attribute}]` : attribute
  const separator = isArray ? '' : '.'

  return compact([path, key]).join(separator)
}

exports.value = (key, payload) => isNil(key) ? payload : (payload && payload[key])

exports.key = (key, validator) => {
  const ArrayValidator = require('../validators/array')

  return validator instanceof ArrayValidator ? Number(key) : key
}