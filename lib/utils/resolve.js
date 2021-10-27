'use strict'

const sito = require('../index')
const { isNil } = require('./predicates')
const { compact } = require('./array')

exports.shape = (schemaValidator, payload) => {
  const validatorShape = schemaValidator.getShape()
  const itemValidator = schemaValidator.getItemValidator()

  const shouldSetAdditionalValidator = Boolean(schemaValidator.isStrict() || itemValidator)

  if (shouldSetAdditionalValidator) {
    const payloadKeys = payload ? Object.keys(payload) : []

    for (const key of payloadKeys) {
      if (itemValidator) {
        validatorShape[key] = itemValidator
      }

      if (schemaValidator.isStrict() && !validatorShape[key]) {
        validatorShape[key] = sito.forbidden()
      }
    }
  }

  return validatorShape
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