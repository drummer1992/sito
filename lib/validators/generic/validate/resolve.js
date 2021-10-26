'use strict'

const GenericValidator = require('../index')
const ArrayValidator = require('../../array')
const { forbidden } = require('../../../index')
const { isNil } = require('../../../utils/predicates')
const { compact } = require('../../../utils/array')

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
        validatorShape[key] = forbidden()
      }
    }
  }

  return validatorShape
}

exports.validator = (validator, payload, key, object) => {
  if (validator instanceof GenericValidator) {
    return validator
  } else if (typeof validator === 'function') {
    return validator(payload, key, object)
  }

  throw new Error(
      'Not valid validator provided. '
      + 'It should be instance of GenericValidator, '
      + 'or the function which returns instance of GenericValidator.',
  )
}

exports.path = (path, attribute, validator) => {
  const isArray = validator instanceof ArrayValidator
  const key = isArray ? `[${attribute}]` : attribute
  const separator = isArray ? '' : '.'

  return compact([path, key]).join(separator)
}

exports.value = (key, payload) => isNil(key) ? payload : (payload && payload[key])

exports.key = (key, validator) => validator instanceof ArrayValidator ? Number(key) : key