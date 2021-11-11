'use strict'

const sito = require('../index')
const { isNil, isUndefined } = require('./predicates')
const { and, truthful } = require('../utils/function')
const { compact } = require('./array')
const { InternalValidatorError } = require('../errors')
const { keys } = require('./object')

const shouldBeForbidden = (key, schema, shape) => {
  return schema.isStrict() && !shape[key]
}

const hasShapeValidator = schema => {
  return Boolean(schema.getShapeValidator())
}

const shouldEnrichShape = schema => {
  return schema.isStrict() || hasShapeValidator(schema)
}

const getEnrichedShape = (schema, payload) => {
  const shape = schema.getShape()

  for (const key of keys(payload)) {
    if (hasShapeValidator(schema)) {
      shape[key] = schema.getShapeValidator()
    }

    if (shouldBeForbidden(key, schema, shape)) {
      shape[key] = sito.forbidden()
    }
  }

  return shape
}

exports.shape = (schema, payload) => {
  if (shouldEnrichShape(schema)) {
    return getEnrichedShape(schema, payload)
  }

  return schema.getShape()
}

exports.validator = (params, value) => {
  const GenericValidator = require('../validators/generic')

  let validator = params.validator

  if (typeof validator === 'function') {
    validator = validator(value, params.key, params.payload)
  }

  if (validator instanceof GenericValidator) {
    return validator
  }

  throw new InternalValidatorError(
      'Not valid validator provided. '
      + 'It should be instance of GenericValidator, '
      + 'or the function which returns instance of GenericValidator.',
  )
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

const makeOptional = validate => value => {
  if (isUndefined(value)) {
    return true
  }

  return validate(value)
}

exports.validate = (checkDto, commonCheck) => {
  if (!checkDto.enabled) {
    return truthful
  }

  let validate = checkDto.validate

  if (checkDto.optional) {
    if (commonCheck) {
      validate = and(commonCheck.validate, validate)
    }

    validate = makeOptional(validate)
  }

  return validate
}